# from django.contrib.auth.decorators import login_required
from django.shortcuts import render
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
        print(self.request.session)
        return {
            'is_student': self.lti.lis_result_sourcedid(self.request),
            'course_title': self.lti.course_title(self.request),
            'number': 1
        }



# @login_required
# @require_canvas_oauth_token
# @csrf_exempt
# @xframe_options_exempt
# def index(request, **kwargs):
#     '''
#     Processes launch request and redirects to appropriate view depending on the role of the launcher
#     '''
# 
#     #True if this is a typical lti launch. False if not.
#     is_basic_lti_launch = request.method == 'POST' and request.POST.get(
#         'lti_message_type') == 'basic-lti-launch-request'
# 
#     context = {
# 
#     }
# 
#     print(request.user)
# 
#     # it should be possible here to pass some context based on the lti request
#     # course_id, user "role"
#     # we'll need to make sure users only see what they are supposed to
#     return render(request, 'frontend/index.html')
