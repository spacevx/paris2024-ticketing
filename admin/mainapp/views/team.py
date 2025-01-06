from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Team
from ..serializers import TeamSerializer

class TeamView(APIView):
    def get(self, request, pk=None):
        stadiums = Team.objects.all()
        serializer = TeamSerializer(stadiums, many=True)
        if (len(serializer.data) <= 0):
            return Response({
                'message': 'Aucune équipe présent dans la base de données'
            }, status=status.HTTP_200_OK)
        return Response(serializer.data)