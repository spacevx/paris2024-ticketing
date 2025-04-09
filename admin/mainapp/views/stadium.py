from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Stadium
from ..serializers import StadiumSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

@method_decorator(ensure_csrf_cookie, name='dispatch')
class StadiumView(APIView):
    def get(self, request, pk=None):
        stadiums = Stadium.objects.all()
        serializer = StadiumSerializer(stadiums, many=True)
        if (len(serializer.data) <= 0):
            return Response({
                'message': 'Aucun stade présent dans la base de données'
            }, status=status.HTTP_200_OK)
        return Response(serializer.data)