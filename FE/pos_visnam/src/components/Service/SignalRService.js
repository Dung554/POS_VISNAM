import * as signalR from "@microsoft/signalr";

// Kết nối đến SignalR Hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7125/orderHub") // Thay đổi URL theo backend của bạn
    .withAutomaticReconnect()
    .build();

// Lắng nghe sự kiện nhận order mới
connection.on("ReceiveOrderUpdate", (orderData) => {
    console.log("New order received:", orderData);
    // Cập nhật UI với order mới
    // Ví dụ: setOrders([orderData, ...orders]);
});

// Bắt đầu kết nối
connection.start()
    .then(() => console.log("Connected to SignalR"))
    .catch(err => console.error("Error connecting to SignalR:", err));

// Khi component unmount, ngắt kết nối
// connection.stop();