from rest_framework import serializers
from ..models import Ticket, Event

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
    

class BuyTicketSerializer(serializers.Serializer):
    ticket_count = serializers.IntegerField()
    category = serializers.ChoiceField(choices=["Silver", "Gold", "Platinium"])
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())  # Assurez-vous que l'événement existe dans la base de données

    def validate_ticket_count(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le nombre de tickets doit être supérieur à 0")
        return value

    def validate_category(self, value):
        if value not in ["Silver", "Gold", "Platinium"]:
            raise serializers.ValidationError("La catégorie de ticket doit être Silver, Gold ou Platinium")
        return value

    def create(self, validated_data):
        
        category = validated_data.get("category")
        ticket_count = validated_data.get("ticket_count")
        event = validated_data.get("event")
        
        if category == "Silver":
            price = 50.00
        elif category == "Gold":
            price = 100.00
        elif category == "Platinium":
            price = 150.00
        
        ticket = Ticket.objects.create(
            event=event,
            category=category,
            price=price,
            ticket_count=ticket_count
        )
        
        return ticket
