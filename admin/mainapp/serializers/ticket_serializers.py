from rest_framework import serializers
from ..models import Ticket, Event, SingleTicket
from django.contrib.auth import get_user_model

class SingleTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleTicket
        fields = ['uuid', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    single_tickets = SingleTicketSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'user', 'event', 'category', 'price', 'ticket_count', 'single_tickets']

class BuyTicketSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    ticket_count = serializers.IntegerField()
    category = serializers.ChoiceField(choices=Ticket.CATEGORY_CHOICES)
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    def validate_user(self, value):
        User = get_user_model()
        try:
            user = User.objects.get(id=value)
            return value  # Return the ID directly
        except User.DoesNotExist:
            raise serializers.ValidationError("L'utilisateur spécifié n'existe pas.")

    def validate_ticket_count(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le nombre de tickets doit être supérieur à 0")
        return value

    def validate_category(self, value):
        valid_categories = [choice[0] for choice in Ticket.CATEGORY_CHOICES]
        if value not in valid_categories:
            raise serializers.ValidationError("La catégorie de ticket doit être Silver, Gold ou Platinium")
        return value

    def create(self, validated_data):
        category = validated_data.get("category")
        ticket_count = validated_data.get("ticket_count")
        event = validated_data.get("event")
        user = validated_data.get("user")
        
        price_mapping = {
            "Silver": 50.00,
            "Gold": 100.00,
            "Platinium": 150.00
        }
        price = price_mapping.get(category)
        
        ticket = Ticket.objects.create(
            user=user,
            event=event,
            category=category,
            price=price,
            ticket_count=ticket_count
        )
        
        return ticket