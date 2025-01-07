# mainapp/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ..models import Ticket
from ..serializers import BuyTicketSerializer, TicketSerializer

class TicketView(APIView):
    def get(self, request, pk=None):
        try:
            # Si un pk est fourni, on recherche par uuid
            if pk:
                ticket = Ticket.objects.get(uuid=pk)
                serializer = TicketSerializer(ticket)
                return Response(serializer.data)
            
            # Sinon on récupère tous les tickets
            tickets = Ticket.objects.all()
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
        serializer = BuyTicketSerializer(data=request.data)
        if serializer.is_valid():
            ticket = serializer.save()
            return Response({
                "ticket": serializer.data,
                "message": "Ticket acheté avec succès"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)