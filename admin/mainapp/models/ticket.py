import uuid
from django.db import models

class Ticket(models.Model):
    SILVER = 'Silver'
    GOLD = 'Gold'
    PLATINUM = 'Platinum'
    
    CATEGORY_CHOICES = [
        (SILVER, 'Silver'),
        (GOLD, 'Gold'),
        (PLATINUM, 'Platinum'),
    ]
    
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey("Event", on_delete=models.PROTECT)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default=SILVER)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    ticket_count = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.event} - {self.category} - {self.price} €"
