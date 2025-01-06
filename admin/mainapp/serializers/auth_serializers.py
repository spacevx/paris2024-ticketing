from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class LoginSerializer(serializers.Serializer):  # Pas ModelSerializer ici car on ne veut pas créer un user
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = User.objects.filter(username=username).first()

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
                    'username': 'Utilisateur non trouvé.'
                })
        else:
            raise serializers.ValidationError({
                'error': 'Le nom d\'utilisateur et le mot de passe sont requis.'
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