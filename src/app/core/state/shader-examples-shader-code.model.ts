export interface ShaderExamplesShaderCode {
  shaderCode: string;
}

/**
 * A factory function that creates ShaderExamplesShaderCode
 * @param params
 */
export function createShaderExamplesShaderCode(params: Partial<ShaderExamplesShaderCode>) {
  return {
      ...params
  } as ShaderExamplesShaderCode;
}
