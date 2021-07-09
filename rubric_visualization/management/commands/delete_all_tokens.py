from django.core.management.base import BaseCommand

from canvas_oauth.models import CanvasOAuth2Token


class Command(BaseCommand):
    help = 'Deletes all tokens. To be used if app OAuth scope changes'

    def add_arguments(self, parser):
        parser.add_argument("--no_input", action="store_true", help="JSON file to be scrubbed")

    def handle(self, *args, **options):
        """Deletes all oauth tokens"""

        if not options["no_input"]:
            confirmation = input("Are you sure that you want to delete all oauth tokens? ['yes' to confirm]: ")
            if confirmation == "yes":
                task_result = delete_all_tokens()
            else:
                self.stdout.write("Exiting")
        else:
            task_result = delete_all_tokens()

        if task_result:
            self.stdout.write(self.style.SUCCESS(f"Successfully deleted {task_result} tokens"))
        else:
            self.stdout.write("There was an error. No tokens deleted.")
        
        return 0


def delete_all_tokens():
    try:
        num_deleted, _ = CanvasOAuth2Token.objects.all().delete()
        return num_deleted
    except:
        return False
