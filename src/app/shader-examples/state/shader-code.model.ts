import {guid, ID} from '@datorama/akita';

export interface ShaderCode {
  id: ID;
  code: string;
  description: string;
}

/**
 * A factory function that creates ShaderCode
 * @param params
 */
export function createShaderCode(
  {
    id = guid(), code = '', description = ''
  }: Partial<ShaderCode>) {
  return {id, code, description} as ShaderCode;
}
