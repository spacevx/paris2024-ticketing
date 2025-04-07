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
            if pk:
                try:
                    ticket = Ticket.objects.get(uuid=pk)
                    serializer = TicketSerializer(ticket)
                    return Response(serializer.data)
                except Ticket.DoesNotExist:
                    # Si on ne trouve pas le ticket on check les SingleTicket
                    try:
                        from ..models import SingleTicket
                        single_ticket = SingleTicket.objects.get(uuid=pk)
                        # Ticket parent via la catégorie
                        ticket = single_ticket.category.ticket
                        serializer = TicketSerializer(ticket)
                        print("Ticket trouvé via SingleTicket")
                        return Response(serializer.data)
                    except SingleTicket.DoesNotExist:
                        # (uuid-category-index)
                        if '-' in pk:
                            parts = pk.split('-')
                            if len(parts) >= 2:
                                ticket_uuid = parts[0]
                                try:
                                    ticket = Ticket.objects.get(uuid=ticket_uuid)
                                    serializer = TicketSerializer(ticket)
                                    return Response(serializer.data)
                                except Ticket.DoesNotExist:
                                    pass
                        
                        return Response({
                            "message": f"Ticket avec l'UUID {pk} non trouvé"
                        }, status=status.HTTP_404_NOT_FOUND)
            
            # Vraiment pas fou mais au cas ou, on récupére tous les tickets et on check
            tickets = Ticket.objects.all().order_by('-created_at')
            serializer = TicketSerializer(tickets, many=True)
            
            if len(serializer.data) <= 0:
                return Response({
                    "message": "Aucun ticket trouvé"
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.data)

        except Exception as error:
            return Response({
                "message": f"Erreur lors de la récupération du ticket: {str(error)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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