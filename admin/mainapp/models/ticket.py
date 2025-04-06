import uuid
from django.db import models
from django.contrib.auth import get_user_model

class Ticket(models.Model):
    SILVER = 'Silver'
    GOLD = 'Gold'
    PLATINIUM = 'Platinium'      
    CATEGORY_CHOICES = [
        (SILVER, 'Silver'),
        (GOLD, 'Gold'),
        (PLATINIUM, 'Platinium'),
    ]
    
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    def __str__(self):
        return f"Ticket {self.uuid} - {self.event}"
    
    # Pour récupérer le prix total
    def get_total_price(self):
        return sum(category.price * category.count for category in self.categories.all())
    
    # Pour récupérer tous les tickets
    def get_total_tickets(self):
        return sum(category.count for category in self.categories.all())


class TicketCategory(models.Model):
    ticket = models.ForeignKey(Ticket, related_name='categories', on_delete=models.CASCADE)
    category = models.CharField(max_length=10, choices=Ticket.CATEGORY_CHOICES)
    count = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"{self.category} ({self.count}) - {self.ticket.event}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        current_tickets = SingleTicket.objects.filter(category=self).count()
        
        if current_tickets < self.count:
            tickets_to_create = self.count - current_tickets
            SingleTicket.objects.bulk_create([
                SingleTicket(category=self)
                for _ in range(tickets_to_create)
            ])
        elif current_tickets > self.count:
            tickets_to_remove = current_tickets - self.count
            SingleTicket.objects.filter(category=self).order_by('-id')[:tickets_to_remove].delete()


class SingleTicket(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(TicketCategory, on_delete=models.CASCADE, related_name='single_tickets')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Billet {self.uuid} - {self.category.category} - {self.category.ticket.event}"