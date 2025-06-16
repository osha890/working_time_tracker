from django.http import HttpResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tracker.serializers.report import ReportSerializer
from tracker.services.reports import (
    ReportBuilder,
    ReportQueryBuilder,
    generate_xlsx_report,
)


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user

        report_queryset = ReportQueryBuilder(user, data).create_filters().build()

        report = ReportBuilder(report_queryset).to_aggregate(data.get("aggregate_total", False)).build()

        report_format = data.get("report_format")
        if report_format == "xlsx":
            xlsx_file = generate_xlsx_report(report)
            response = HttpResponse(xlsx_file, content_type="application/octet-stream")
            response["Content-Disposition"] = 'attachment; filename="report.xlsx"'
            return response
        return Response(report)
