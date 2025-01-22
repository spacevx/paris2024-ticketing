from rest_framework import serializers
from ..models import Ticket, Event
from django.contrib.auth import get_user_model

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
    

class BuyTicketSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    ticket_count = serializers.IntegerField()
    category = serializers.ChoiceField(choices=["Silver", "Gold", "Platinium"])
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())  # Assurez-vous que l'événement existe dans la base de données

    def validate_user(self, value):
        User = get_user_model()
        try:
            user = User.objects.get(id=value)
            return value  # Retourne l'ID au lieu de l'objet user
        except User.DoesNotExist:
            raise serializers.ValidationError("L'utilisateur spécifié n'existe pas.")
        User = get_user_model()
        try:        
            print("SPIO", value)
            user = User.objects.get(id=value)
            print("user exist", user)
            return user
        except user.DoesNotExist:
            raise serializers.ValidationError("L'utilisateur spécifié n'existe pas.")


    def validate_ticket_count(self, value):
        if value <= 0:
            print("TICKET COUNT")
            raise serializers.ValidationError("Le nombre de tickets doit être supérieur à 0")
        return value

    def validate_category(self, value):
        if value not in ["Silver", "Gold", "Platinium"]:
            print("CATEGORY!!")
            raise serializers.ValidationError("La catégorie de ticket doit être Silver, Gold ou Platinium")
        return value

    def create(self, validated_data):
        print("IS CALLED")
        category = validated_data.get("category")
        ticket_count = validated_data.get("ticket_count")
        event = validated_data.get("event")
        user = validated_data.get("user")
        
        print("SMI", category, ticket_count, event, user)

        if category == "Silver":
            price = 50.00
        elif category == "Gold":
            price = 100.00
        elif category == "Platinium":
            price = 150.00
        
        ticket = Ticket.objects.create(
            user = user,
            event=event,
            category=category,
            price=price,
            ticket_count=ticket_count
        )
        
        return ticket
