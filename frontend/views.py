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
        # If you want to get a specific LTI property ie 'custom_canvas_course_id'
        # to be made available in self.request.session, you may need to add it
        # to the list setting LTI_PROPERTY_LIST_EX
        # We will probably pass the role in the future as well. It may dictate 
        # what the user sees.
        return {
            'course_id': self.request.session['custom_canvas_course_id'],
            'is_student': self.lti.lis_result_sourcedid(self.request)
        }
