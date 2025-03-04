from django.views.generic import TemplateView
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from ..models import Event, Team, Stadium
from django.urls import reverse, reverse_lazy
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.http import HttpResponseRedirect
from django.core.serializers.json import DjangoJSONEncoder
from django.template.defaultfilters import register
import json

@register.filter(is_safe=True)
def jsonify(obj):
    # Nous permet de convertir un objet en JSON pour l'utiliser directement dans le JS
    from django.utils.safestring import mark_safe
    return mark_safe(json.dumps(obj, cls=DjangoJSONEncoder))    

class CreateEventView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Event
    fields = ['team_home', 'team_away', 'stadium', 'start', 'score']
    success_url = reverse_lazy('myadmin:my_admin')
    login_url = '/myadmin/login/' # Si la personne n'est pas connectée, ça la redirige vers login_url 

    def test_func(self):
        return self.request.user.is_superuser

class DeleteEventView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Event
    success_url = reverse_lazy('myadmin:my_admin')
    login_url = '/myadmin/login/'

    def test_func(self):
        return self.request.user.is_superuser

class AdminView(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'jo_admin.html' # Ma template html
    login_url = '/myadmin/login/'
    
    def test_func(self):
        return self.request.user.is_superuser
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        events = Event.objects.all().order_by('start')
        
        events_dict = {}
        for event in events:
            events_dict[str(event.id)] = {
                'team_home_id': event.team_home.id if event.team_home else None,
                'team_away_id': event.team_away.id if event.team_away else None,
                'stadium_id': event.stadium.id if event.stadium else None,
                'start': event.start.strftime('%Y-%m-%dT%H:%M') if event.start else '',
                'score': event.score or '',
                'winner_id': event.winner.id if event.winner else None
            }
        
        context['events'] = events
        context['events_dict'] = events_dict
        context['teams'] = Team.objects.all()
        context['stadiums'] = Stadium.objects.all()
        return context

class UpdateEventView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Event
    fields = ['team_home', 'team_away', 'stadium', 'start', 'score', 'winner']
    login_url = '/myadmin/login/'

    def test_func(self):
        return self.request.user.is_superuser

    def get_object(self, queryset=None):
        event_id = self.request.POST.get('event_id')
        return Event.objects.get(pk=event_id)

    def post(self, request, *args, **kwargs):
        event_id = request.POST.get('event_id')
        try:
            event = Event.objects.get(pk=event_id)
            
            old_team_home = event.team_home
            old_team_away = event.team_away
            
            event.team_home_id = request.POST.get('team_home')
            event.team_away_id = request.POST.get('team_away')
            event.stadium_id = request.POST.get('stadium')
            event.start = request.POST.get('start')
            event.score = request.POST.get('score')
            
            if event.score:
                try:
                    home_score, away_score = map(int, event.score.split('-'))
                    if home_score > away_score:
                        event.winner = event.team_home
                    elif home_score < away_score:
                        event.winner = event.team_away
                    else:
                        event.winner = None
                except (ValueError, TypeError):
                    pass

            event.save()
            
            return HttpResponseRedirect(reverse('myadmin:my_admin'))
        
        except Event.DoesNotExist:
            return HttpResponseRedirect(reverse('myadmin:my_admin'))