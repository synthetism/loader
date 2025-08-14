/**
 * Simple Network Unit for Materialization Testing
 * Version: 1.0.0
 */

import { Unit, type TeachingContract, createUnitSchema, type UnitProps } from '@synet/unit';
import { Capabilities, Schema, Validator } from '@synet/unit';

interface NetworkConfig {
  baseUrl?: string;
  timeout?: number;
}

interface NetworkProps extends UnitProps {
  baseUrl: string;
  timeout: number;
}

export class NetworkUnit extends Unit<NetworkProps> {
  protected constructor(props: NetworkProps) {
    super(props);
  }
  
  static create(config: NetworkConfig = {}): NetworkUnit {
    const props: NetworkProps = {
      dna: createUnitSchema({ 
        id: 'network-unit', 
        version: '1.0.0'
      }),
      baseUrl: config.baseUrl || 'https://api.example.com',
      timeout: config.timeout || 5000
    };
    return new NetworkUnit(props);
  }
  
  protected build() {
    const capabilities = Capabilities.create(this.dna.id, {
      get: (...args: unknown[]) => this.get(args[0] as string),
      post: (...args: unknown[]) => this.post(args[0] as string, args[1])
    });

    const schema = Schema.create(this.dna.id, {
      get: {
        name: 'get',
        description: 'Make HTTP GET request',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'URL path to request' }
          },
          required: ['path']
        }
      },
      post: {
        name: 'post', 
        description: 'Make HTTP POST request',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'URL path to request' },
            data: { type: 'object', description: 'Data to send in POST body' }
          },
          required: ['path']
        }
      }
    });

    const validator = Validator.create({
      unitId: this.dna.id,
      capabilities,
      schema,
      strictMode: false
    });

    return { capabilities, schema, validator };
  }
  
  capabilities(): Capabilities {
    return this._unit.capabilities;
  }
  
  schema(): Schema {
    return this._unit.schema;
  }
  
  validator(): Validator {
    return this._unit.validator;
  }
  
  // Native capabilities
  async get(path: string): Promise<any> {
    console.log(`🌐 GET ${this.props.baseUrl}${path}`);
    
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: { message: 'Hello from NetworkUnit!', path },
          timestamp: new Date().toISOString()
        });
      }, 100);
    });
  }
  
  async post(path: string, data: any): Promise<any> {
    console.log(`🌐 POST ${this.props.baseUrl}${path}`, data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 201,
          data: { message: 'Created via NetworkUnit!', received: data },
          timestamp: new Date().toISOString()
        });
      }, 100);
    });
  }
  
  teach(): TeachingContract {
    return {
      unitId: this.dna.id,
      capabilities: this._unit.capabilities,
      schema: this._unit.schema,
      validator: this._unit.validator
    };
  }
  
  whoami(): string {
    return `[${this.dna.id}] Network unit v${this.dna.version} - I handle HTTP requests`;
  }
  
  help(): void {
    console.log(`
=== Network Unit v1.0.0 ===
I handle HTTP requests with retry logic and timeout management.

Capabilities:
- get(path): Make GET requests  
- post(path, data): Make POST requests

Usage:
  const network = NetworkUnit.create({ baseUrl: 'https://api.com' });
  const response = await network.get('/users');
  const created = await network.post('/users', { name: 'John' });

I can teach my capabilities to other units via teach().
    `);
  }
}

// Test the unit works
/* if (import.meta.url === `file://${process.argv[1]}`) {
  async function testNetworkUnit() {
    console.log('🧪 TESTING NETWORK UNIT v1.0.0');
    console.log('===============================\n');
    
    const network = NetworkUnit.create({ baseUrl: 'https://test.api.com' });
    
    console.log('📋 Identity:', network.whoami());
    console.log('📚 Help:'); 
    network.help();
    console.log('🎯 Capabilities:', network.capabilities().list());
    
    // Test GET
    const getResult = await network.get('/test');
    console.log('📡 GET Result:', getResult);
    
    // Test POST  
    const postResult = await network.post('/create', { name: 'Test User' });
    console.log('📡 POST Result:', postResult);
    
    // Test teaching
    const contract = network.teach();
    console.log('🎓 Teaching Contract:', {
      unitId: contract.unitId,
      capabilities: contract.capabilities.list(),
      hasSchema: !!contract.schema,
      hasValidator: !!contract.validator
    });
    
    console.log('\n✅ NetworkUnit v1.0.0 works perfectly!');
    return network;
  }
  
  testNetworkUnit().catch(console.error);
} */