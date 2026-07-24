import { Address, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';

export function addressToScVal(addressStr: string): xdr.ScVal {
  return Address.fromString(addressStr).toScVal();
}

export function bytesToScVal(buffer: Buffer | Uint8Array): xdr.ScVal {
  return nativeToScVal(buffer, { type: 'bytes' });
}

export function symbolToScVal(str: string): xdr.ScVal {
  return nativeToScVal(str, { type: 'symbol' });
}

export function stringToScVal(str: string): xdr.ScVal {
  return nativeToScVal(str, { type: 'string' });
}

export function u32ToScVal(val: number): xdr.ScVal {
  return nativeToScVal(val, { type: 'u32' });
}

export function i32ToScVal(val: number): xdr.ScVal {
  return nativeToScVal(val, { type: 'i32' });
}

export function u64ToScVal(val: bigint | number): xdr.ScVal {
  return nativeToScVal(val, { type: 'u64' });
}

export function i64ToScVal(val: bigint | number): xdr.ScVal {
  return nativeToScVal(val, { type: 'i64' });
}

export { scValToNative };
