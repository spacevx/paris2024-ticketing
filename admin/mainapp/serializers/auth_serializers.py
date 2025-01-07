from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from django.db.models import Q

class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        if login and password:
            # Chercher l'utilisateur par username ou email
            user = User.objects.filter(
                Q(username=login) | Q(email=login)
            ).first()

            if user:
                if user.check_password(password):
                    attrs['user'] = user
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
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        
        return user