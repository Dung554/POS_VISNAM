namespace POS_VISNAM.Repositories.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderCode { get; set; } = string.Empty; 
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now; 
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
