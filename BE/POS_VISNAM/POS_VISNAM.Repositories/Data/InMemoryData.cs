using POS_VISNAM.Repositories.Entities;

namespace POS_VISNAM.Data
{
    public static class InMemoryData
    {
        public static List<Product> Products { get; set; } = new()
        {
            new Product { Id = 1, Name = "Cà phê đen", Price = 25000, IsActive = true },
            new Product { Id = 2, Name = "Cà phê sữa", Price = 30000, IsActive = true },
            new Product { Id = 3, Name = "Trà đào", Price = 35000, IsActive = true },
            new Product { Id = 4, Name = "Trà sữa truyền thống", Price = 32000, IsActive = true },
            new Product { Id = 5, Name = "Sinh tố bơ", Price = 40000, IsActive = true },
            new Product { Id = 6, Name = "Nước cam ép", Price = 38000, IsActive = true },
            new Product { Id = 7, Name = "Bánh mì", Price = 20000, IsActive = true },
            new Product { Id = 8, Name = "Croissant", Price = 28000, IsActive = true },
            new Product { Id = 9, Name = "Tiramisu", Price = 45000, IsActive = true },
            new Product { Id = 10, Name = "Nước suối", Price = 10000, IsActive = false }
        };

        public static List<Order> Orders { get; set; } = new()
        {
            new Order
            {
                Id = 1,
                OrderCode = "ORD20251215001",
                TotalAmount = 85000,
                CreatedAt = new DateTime(2025, 12, 15, 8, 30, 0),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem { Id = 1, OrderId = 1, ProductId = 1, Quantity = 2, Subtotal = 50000 },
                    new OrderItem { Id = 2, OrderId = 1, ProductId = 3, Quantity = 1, Subtotal = 35000 }
                }
            },
            new Order
            {
                Id = 2,
                OrderCode = "ORD20251215002",
                TotalAmount = 110000,
                CreatedAt = new DateTime(2025, 12, 15, 9, 15, 0),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem { Id = 3, OrderId = 2, ProductId = 5, Quantity = 1, Subtotal = 40000 },
                    new OrderItem { Id = 4, OrderId = 2, ProductId = 4, Quantity = 2, Subtotal = 64000 },
                    new OrderItem { Id = 5, OrderId = 2, ProductId = 6, Quantity = 1, Subtotal = 38000 }
                }
            },
            new Order
            {
                Id = 3,
                OrderCode = "ORD20251215003",
                TotalAmount = 93000,
                CreatedAt = new DateTime(2025, 12, 15, 10, 45, 0),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem { Id = 6, OrderId = 3, ProductId = 9, Quantity = 1, Subtotal = 45000 },
                    new OrderItem { Id = 7, OrderId = 3, ProductId = 7, Quantity = 2, Subtotal = 40000 },
                    new OrderItem { Id = 8, OrderId = 3, ProductId = 8, Quantity = 1, Subtotal = 28000 }
                }
            }
        };

        // Counter để tạo ID mới
        public static int NextProductId => Products.Any() ? Products.Max(p => p.Id) + 1 : 1;
        public static int NextOrderId => Orders.Any() ? Orders.Max(o => o.Id) + 1 : 1;
        public static int NextOrderItemId
        {
            get
            {
                var allItems = Orders.SelectMany(o => o.OrderItems);
                return allItems.Any() ? allItems.Max(i => i.Id) + 1 : 1;
            }
        }

        // Helper method để tạo mã đơn hàng
        public static string GenerateOrderCode()
        {
            var date = DateTime.Now.ToString("yyyyMMdd");
            var count = Orders.Count(o => o.OrderCode.StartsWith($"ORD{date}")) + 1;
            return $"ORD{date}{count:D3}";
        }
    }
}