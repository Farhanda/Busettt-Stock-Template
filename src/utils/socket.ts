import { UserRole } from './types';

class SocketService {
  private socket: WebSocket | null = null;

  connect(userId: string, role: UserRole) {
    if (this.socket) return;

    // Kirim userId dan role via query params
    this.socket = new WebSocket(`ws://localhost:3000?userId=${userId}&role=${role}`);

    this.socket.onopen = () => {
      console.log(`Connected as ${role}`);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleNotification(data);
    };

    this.socket.onclose = () => {
      this.socket = null;
      console.log("Disconnected. Retrying in 5s...");
      setTimeout(() => this.connect(userId, role), 5000);
    };
  }

  private handleNotification(data: any) {
    // Logika notifikasi global (seperti Toast atau Alert)
    console.log("New Update:", data);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const socketService = new SocketService();