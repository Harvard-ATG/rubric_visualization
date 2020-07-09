from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView

from lti_provider.mixins import LTIAuthMixin
from rubric_visualization.decorators import require_canvas_oauth_token

decorators = [csrf_exempt, xframe_options_exempt, require_canvas_oauth_token]
@method_decorator(decorators, name='dispatch')
class IndexView(LTIAuthMixin, LoginRequiredMixin, TemplateView):

    template_name = 'frontend/index.html'

    def get_context_data(self, **kwargs):
        # I'm getting the course ID by doing some hackery with a session attribute.
        # There has to be a simpler way to get that value.
        # We will probably pass the role in the future as well. It may dictate 
        # what the user sees.
        return {
            'course_id': self.request.session['launch_presentation_return_url'].split("/")[4],
            'is_student': self.lti.lis_result_sourcedid(self.request)
        }
