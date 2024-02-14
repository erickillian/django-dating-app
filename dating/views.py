from allauth.account.views import ConfirmEmailView
from django.views.generic import TemplateView

class CustomEmailConfirmView(TemplateView):
    template_name = 'account/email_confirm.html'

    def get(self, request, *args, **kwargs):
        # You can add additional context or logic here if necessary
        return super().get(request, *args, **kwargs)
