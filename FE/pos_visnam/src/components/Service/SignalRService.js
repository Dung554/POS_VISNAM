import * as signalR from '@microsoft/signalr';

// Khớp với app.MapHub<OrderHub>("/orderHub");
const SIGNALR_URL = 'https://localhost:7125/orderHub';

class SignalRService {
  constructor() {
    this.connection = null;
  }

  // Khởi tạo kết nối
  startConnection = async () => {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
      return true;
    } catch (err) {
      console.error('SignalR Connection Error:', err);
      return false;
    }
  };

  // Lắng nghe sự kiện nhận order mới
  onReceiveOrderUpdate = (callback) => {
    if (this.connection) {
      this.connection.on('ReceiveOrderUpdate', callback);
    }
  };

  // Ngắt kết nối
  stopConnection = async () => {
    if (this.connection) {
      await this.connection.stop();
      console.log('SignalR Disconnected');
    }
  };

  // Kiểm tra trạng thái kết nối
  isConnected = () => {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  };
}

export default new SignalRService();