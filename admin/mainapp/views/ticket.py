# mainapp/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ..models import Ticket
from ..serializers import BuyTicketSerializer, TicketSerializer
from django.contrib.auth import get_user_model


class TicketView(APIView):
    def get(self, request, pk=None):
        try:
            # Si clé primaire alors on cherche via l'uuid
            if pk:
                ticket = Ticket.objects.get(uuid=pk)
                serializer = TicketSerializer(ticket)
                return Response(serializer.data)
            
            # Sinon on récupère tous les tickets
            # distinct() pour éviter les doublons quand on a plusieurs catégories
            tickets = Ticket.objects.all().order_by('-created_at')
            serializer = TicketSerializer(tickets, many=True)
            
            if len(serializer.data) <= 0:
                return Response({
                    "message": "Aucun ticket trouvé"
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.data)

        except Ticket.DoesNotExist:
            return Response({
                "message": f"Ticket avec l'UUID {pk} non trouvé"
            }, status=status.HTTP_404_NOT_FOUND)

class BuyTicketView(APIView):
    def post(self, request):
        data = request.data.copy()
        
        # (Ancien format de ticket)
        if 'category' in data and 'ticket_count' in data:
            category = data.pop('category')
            count = data.pop('ticket_count')
            data['tickets'] = {
                category: int(count) if isinstance(count, str) else count
            }
        
        if 'user' in data:
            print("id utilisateur: ", data['user'])
            User = get_user_model()
            try:
                user = User.objects.get(id=data['user'])
                print("utilisateur: ", user)
            except User.DoesNotExist:
                print("utilisateur n'existe pas")
                return Response({"user": ["L'utilisateur spécifié n'existe pas"]}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = BuyTicketSerializer(data=data)
        
        if serializer.is_valid():
            ticket = serializer.save()
            return Response({
                "ticket": TicketSerializer(ticket).data,
                "message": "Ticket acheté avec succès"
            }, status=status.HTTP_201_CREATED)
        
        #print("Erreurs pendant la serialization:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)