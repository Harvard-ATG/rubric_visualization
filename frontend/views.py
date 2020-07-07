from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from rubric_visualization.decorators import require_canvas_oauth_token
from django.views.generic.base import TemplateView
from lti_provider.mixins import LTIAuthMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator

decorators = [csrf_exempt, xframe_options_exempt, require_canvas_oauth_token]
@method_decorator(decorators, name='dispatch')
class IndexView(LTIAuthMixin, LoginRequiredMixin, TemplateView):

    template_name = 'frontend/index.html'

    def get_context_data(self, **kwargs):
        return {
            'is_student': self.lti.lis_result_sourcedid(self.request),
            'course_title': self.lti.course_title(self.request),
            'number': 1
        }
