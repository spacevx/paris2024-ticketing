from rest_framework import serializers
from ..models import Team

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__' # On veut tous les champs de team