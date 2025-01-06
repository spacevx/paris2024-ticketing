from rest_framework import serializers
from ..models import Stadium

class StadiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stadium
        fields = '__all__' # On veut tous les champs de stadium