from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import logout, login as django_login
from django.contrib.auth.password_validation import validate_password

from django.db.models import Q

class LogoutSerializer(serializers.Serializer):
    def save(self, **kwargs):
        request = self.context.get('request')
        print("here", request)
        if request and hasattr(request, 'user'):
            logout(request)
            return {'detail' : 'Déconnexion réussie'}
        return {'detail' : 'Erreur lors de la déconnexion'}


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user_login = attrs.get('login')
        password = attrs.get('password')
        request = self.context.get('request')

        if user_login and password:
            # Chercher l'utilisateur par username ou email
            user = User.objects.filter(
                Q(username=user_login) | Q(email=user_login)
            ).first()

            if user:
                if user.check_password(password):
                    attrs['user'] = user
                    django_login(request, user)
                    return attrs
                else:
                    raise serializers.ValidationError({
                        'password': 'Mot de passe incorrect.'
                    })
            else:
                raise serializers.ValidationError({
                    'login': 'Aucun utilisateur trouvé avec cet email ou nom d\'utilisateur.'
                })
        else:
            raise serializers.ValidationError({
                'error': 'L\'identifiant et le mot de passe sont requis.'
            })

# ModelSerializer permet de définir les champs de user (spécifié dans la classe Meta) 
# automatiquement, on rajoute juste password/password2
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        return user