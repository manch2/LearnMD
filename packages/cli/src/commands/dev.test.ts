import { beforeEach, describe, expect, it, vi } from 'vitest';
import { devCommand } from './dev';

const createServerMock = vi.fn();
const listenMock = vi.fn().mockResolvedValue(undefined);
const printUrlsMock = vi.fn().mockResolvedValue(undefined);

vi.mock('vite', () => ({
  createServer: (...args: unknown[]) => createServerMock(...args),
}));

describe('devCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createServerMock.mockResolvedValue({
      listen: listenMock,
      printUrls: printUrlsMock,
      httpServer: { on: vi.fn() },
    });
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
    });
  });

  it('starts the Vite dev server with the expected defaults', async () => {
    await devCommand({ port: '4173', host: '0.0.0.0' });

    expect(createServerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        server: expect.objectContaining({
          port: 4173,
          host: '0.0.0.0',
          open: true,
        }),
      })
    );
    expect(listenMock).toHaveBeenCalled();
    expect(printUrlsMock).toHaveBeenCalled();
  });
});
