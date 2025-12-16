using Microsoft.AspNetCore.SignalR;

namespace POS_VISNAM.Hubs
{
    public class OrderHub : Hub
    {
        public async Task SendOrderUpdate(object orderData)
        {
            await Clients.All.SendAsync("ReceiveOrderUpdate", orderData);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
        }
    }
}