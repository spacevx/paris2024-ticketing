from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Event
from ..serializers import EventSerializer

class EventListView(APIView):
    def get(self, request):
        # Filtres possibles
        stadium = request.query_params.get('stadium', None)
        team = request.query_params.get('team', None)
        
        events = Event.objects.all()
        if stadium:
            events = events.filter(stadium_id=stadium)
        if team:
            events = events.filter(team_home_id=team) | events.filter(team_away_id=team)
        
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class EventDetailView(APIView):
    def get(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response(
                {"error": "Événement non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
            serializer = EventSerializer(event, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Event.DoesNotExist:
            return Response(
                {"error": "Événement non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )