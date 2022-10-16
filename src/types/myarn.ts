export interface MyarnConfig {
  name: string;
  server: {
    client: string;
    version: string;
    build?: string;
  };
  plugins: Record<string, string>;
}

export interface MyarnLockFileInfomation {
  
}

export interface MyarnLock {
  lockfileVersion: number;
  server: {
    client: string;
    version: string;
    build?: string;
    integrity: string;
    file: string;
  } | null;
}

