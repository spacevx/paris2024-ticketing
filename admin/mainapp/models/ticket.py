import uuid
from django.db import models

class Ticket(models.Model):
    SILVER = 'Silver'
    GOLD = 'Gold'
    PLATINIUM = 'Platinium'      
    CATEGORY_CHOICES = [
        (SILVER, 'Silver'),
        (GOLD, 'Gold'),
        (PLATINIUM, 'Platinium'),
    ]
    
    user = models.PositiveIntegerField()
    event = models.ForeignKey("Event", on_delete=models.PROTECT)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default=SILVER)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    ticket_count = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.event} - {self.category} - {self.price} €"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        current_tickets = SingleTicket.objects.filter(parent_ticket=self).count()
        
        if current_tickets < self.ticket_count:
            tickets_to_create = self.ticket_count - current_tickets
            SingleTicket.objects.bulk_create([
                SingleTicket(parent_ticket=self)
                for _ in range(tickets_to_create)
            ])
        elif current_tickets > self.ticket_count:
            tickets_to_remove = current_tickets - self.ticket_count
            SingleTicket.objects.filter(parent_ticket=self).order_by('-id')[:tickets_to_remove].delete()

class SingleTicket(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='single_tickets')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket {self.uuid} - {self.parent_ticket.event}"