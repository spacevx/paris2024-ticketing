from rest_framework import serializers
from ..models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def validate(self, attrs):
        # On check que les deux équipes ne sont pas les mêmes
        if attrs.get('team_home') == attrs.get('team_away'):
            raise serializers.ValidationError({
                "teams": "Les équipes domicile et extérieur doivent être différentes"
            })

        # Il faut que l'une des deux équipes gagne (peut être faire un système de match null?)
        # TODO: a voir car si le match n'est pas passé encore ça peut être null, pareil pour le score
        winner = attrs.get('winner')
        if winner and winner not in [attrs.get('team_home'), attrs.get('team_away')]:
            raise serializers.ValidationError({
                "winner": "Le vainqueur doit être l'une des équipes participantes"
            })

        # On check si le format du score est bon (ex: 2-1) 
        score = attrs.get('score')
        if score:
            if not score.replace('-', '').isdigit() or score.count('-') != 1:
                raise serializers.ValidationError({
                    "score": "Le format du score doit être 'X-X' où X est un nombre"
                })

        return attrs