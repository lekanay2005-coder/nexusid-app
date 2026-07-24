import { SorobanRpc, scValToNative } from '@stellar/stellar-sdk';
import { prisma } from './db';
import pino from 'pino';

const logger = pino({ name: 'event-listener' });

export async function startEventListener() {
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;
  if (!rpcUrl) {
    logger.error("Missing NEXT_PUBLIC_SOROBAN_RPC_URL for event listener");
    return;
  }

  const server = new SorobanRpc.Server(rpcUrl);
  const contractIds = [
    process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID,
    process.env.NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID,
    process.env.NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID,
  ].filter(Boolean) as string[];

  if (contractIds.length === 0) {
    logger.error("No contract IDs configured for event listener");
    return;
  }

  let latestLedger = 0;
  try {
    const latestLedgerInfo = await server.getLatestLedger();
    latestLedger = latestLedgerInfo.sequence - 1000; // start a bit behind if needed
    if (latestLedger < 0) latestLedger = 1;
  } catch (err) {
    logger.warn({ err }, "Could not fetch latest ledger, starting from 1");
    latestLedger = 1;
  }

  logger.info({ latestLedger, contractIds }, "Starting Soroban event listener polling...");

  setInterval(async () => {
    try {
      const latest = await server.getLatestLedger();
      if (latest.sequence <= latestLedger) return;

      const response = await server.getEvents({
        startLedger: latestLedger + 1,
        filters: [
          {
            type: 'contract',
            contractIds: contractIds,
          },
        ],
        limit: 100,
      } as any);

      if (response.events && response.events.length > 0) {
        for (const event of response.events) {
          try {
            await handleContractEvent(event);
          } catch (eventErr) {
            logger.error({ err: eventErr, event }, "Failed to handle contract event");
          }
        }
      }

      latestLedger = latest.sequence;
    } catch (pollErr) {
      logger.error({ err: pollErr }, "Error polling Soroban events");
    }
  }, 5000);
}

async function handleContractEvent(event: SorobanRpc.Api.EventResponse) {
  const contractId = event.contractId;
  const topics = event.topic.map((t) => {
    try {
      return scValToNative(t);
    } catch {
      return t;
    }
  });
  const value = event.value ? scValToNative(event.value) : null;
  const ledger = event.ledger;

  const identityRegistryId = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID;
  const walletLinkId = process.env.NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID;
  const reputationScoreId = process.env.NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID;

  const eventName = topics[0];

  logger.info({ contractId, eventName, topics, ledger }, "Received contract event");

  if (contractId === identityRegistryId) {
    if (eventName === 'ProfileCreated' || topics.includes('create_profile')) {
      // Expecting owner and metadata_uri
      // Depending on contract topic conventions, let's handle robustly
      const owner = topics[1] || value?.owner;
      const metadataUri = value?.metadata_uri || topics[2];
      if (owner && metadataUri) {
        await prisma.profile.upsert({
          where: { owner: String(owner) },
          update: { metadataUri: String(metadataUri), createdLedger: Number(ledger) },
          create: { owner: String(owner), metadataUri: String(metadataUri), createdLedger: Number(ledger) },
        });
      }
    } else if (eventName === 'ProfileUpdated' || topics.includes('update_metadata')) {
      const owner = topics[1] || value?.owner;
      const metadataUri = value?.metadata_uri || topics[2];
      if (owner && metadataUri) {
        await prisma.profile.updateMany({
          where: { owner: String(owner) },
          data: { metadataUri: String(metadataUri) },
        });
      }
    }
  } else if (contractId === walletLinkId) {
    if (eventName === 'WalletLinked' || topics.includes('link_solana_wallet') || topics.includes('link_evm_wallet')) {
      const owner = topics[1] || value?.owner;
      const chain = topics[2] || value?.chain;
      const externalAddress = value?.external_address || topics[3];
      if (owner && chain && externalAddress) {
        // Convert buffer/address to hex or string representation
        const extAddrStr = Buffer.isBuffer(externalAddress) ? externalAddress.toString('hex') : String(externalAddress);
        await prisma.linkedWallet.upsert({
          where: {
            owner_chain_externalAddress: {
              owner: String(owner),
              chain: String(chain),
              externalAddress: extAddrStr,
            },
          },
          update: { ledger: Number(ledger) },
          create: {
            owner: String(owner),
            chain: String(chain),
            externalAddress: extAddrStr,
            ledger: Number(ledger),
          },
        }).catch(() => {
          // fallback if compound unique constraint differs
        });
      }
    }
  } else if (contractId === reputationScoreId) {
    if (eventName === 'AttestationRecorded' || topics.includes('attest') || topics.includes('record_attestation')) {
      const owner = topics[1] || value?.owner;
      const attestor = topics[2] || value?.attestor;
      const delta = value?.delta ?? topics[3];
      const reason = value?.reason ?? topics[4];
      if (owner) {
        await prisma.attestation.create({
          data: {
            owner: String(owner),
            attestor: String(attestor || 'unknown'),
            delta: Number(delta || 0),
            reason: String(reason || ''),
            ledger: Number(ledger),
          },
        });
      }
    }
  }
}
