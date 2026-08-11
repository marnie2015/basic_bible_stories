class ResourceDocumentsController < ApplicationController
  def show
    return head :not_found unless SampleResourcePdfService.valid_document_key?(params[:document_key])

    pdf, filename = SampleResourcePdfService.new(document_key: params[:document_key]).call

    send_data pdf,
              filename: filename,
              type: "application/pdf",
              disposition: "inline"
  end
end
