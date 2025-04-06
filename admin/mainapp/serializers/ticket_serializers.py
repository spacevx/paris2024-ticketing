from rest_framework import serializers
from ..models import Ticket, TicketCategory, Event, SingleTicket
from django.contrib.auth import get_user_model

class SingleTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleTicket
        fields = ['uuid', 'created_at']

class TicketCategorySerializer(serializers.ModelSerializer):
    single_tickets = SingleTicketSerializer(many=True, read_only=True)
    
    class Meta:
        model = TicketCategory
        fields = ['category', 'count', 'price', 'single_tickets']

class TicketSerializer(serializers.ModelSerializer):
    categories = TicketCategorySerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = ['id', 'uuid', 'user', 'event', 'categories', 'total_price', 'created_at']
    
    def get_total_price(self, obj):
        return obj.get_total_price()

class BuyTicketSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    tickets = serializers.DictField(child=serializers.IntegerField(min_value=1))

    def validate_user(self, value):
        User = get_user_model()
        try:
            user = User.objects.get(id=value)
            return value # On return l'id de l'user
        except User.DoesNotExist:
            raise serializers.ValidationError("L'utilisateur spécifié n'existe pas.")

    def validate_tickets(self, value):
        valid_categories = ["Silver", "Gold", "Platinium"]
        for category in value.keys():
            if category not in valid_categories:
                raise serializers.ValidationError(f"La catégorie {category} n'est pas valide. Utilisez Silver, Gold ou Platinium.")
        return value

    def create(self, validated_data):
        user_id = validated_data.get("user")
        event = validated_data.get("event")
        tickets_data = validated_data.get("tickets")
        
        User = get_user_model()
        user = User.objects.get(id=user_id)
        
        price_mapping = {
            "Silver": 100.00,
            "Gold": 150.00,
            "Platinium": 200.00
        }
        
        # Ticket principal
        ticket = Ticket.objects.create(
            user=user,
            event=event,
        )
        
        # Categorie tickets
        for category, count in tickets_data.items():
            price = price_mapping.get(category)
            TicketCategory.objects.create(
                ticket=ticket,
                category=category,
                count=count,
                price=price
            )
        
        return ticket