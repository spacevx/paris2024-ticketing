# mainapp/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import login
from ..serializers import BuyTicketSerializer

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