# Builds simple placeholder PDFs for homepage resource modals.
class SampleResourcePdfService
  ResourceDocument = Data.define(:title, :lines, :filename)

  DOCUMENTS = {
    "table-of-content" => ResourceDocument.new(
      title: "Table of Content",
      filename: "table-of-content.pdf",
      lines: [
        "Basic Bible Stories",
        "Sample Table of Content",
        "1. Welcome and Opening Prayer",
        "2. Bible Story Reading",
        "3. Picture Talk and Questions",
        "4. Memory Truth",
        "5. Activity and Take-Home Practice"
      ]
    ),
    "copyright" => ResourceDocument.new(
      title: "Copyright",
      filename: "copyright.pdf",
      lines: [
        "Basic Bible Stories",
        "Sample Copyright Notice",
        "This placeholder PDF represents future copyright details.",
        "Teachers may preview lessons for classroom planning.",
        "Replace this sample with the final legal document before release."
      ]
    ),
    "curriculum-notes" => ResourceDocument.new(
      title: "Curriculum Notes",
      filename: "curriculum-notes.pdf",
      lines: [
        "Basic Bible Stories",
        "Sample Curriculum Notes",
        "Use short story segments for younger children.",
        "Invite children to retell the lesson with picture prompts.",
        "Close with one simple practice for the week."
      ]
    )
  }.freeze

  def initialize(document_key:)
    @document_key = document_key
  end

  def call
    document = DOCUMENTS.fetch(document_key)

    [ build_pdf(document), document.filename ]
  end

  def self.valid_document_key?(document_key)
    DOCUMENTS.key?(document_key)
  end

  private

  attr_reader :document_key

  def build_pdf(document)
    objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      stream_object(document)
    ]

    assemble_pdf(objects)
  end

  def stream_object(document)
    stream = document.lines.each_with_index.map do |line, index|
      "/F1 #{index.zero? ? 24 : 14} Tf 72 #{720 - (index * 34)} Td (#{escape_pdf_text(line)}) Tj"
    end.join("\n")

    content = "BT\n#{stream}\nET"

    "<< /Length #{content.bytesize} >>\nstream\n#{content}\nendstream"
  end

  def assemble_pdf(objects)
    pdf = +"%PDF-1.4\n"
    offsets = objects.map.with_index(1) do |object, number|
      offset = pdf.bytesize
      pdf << "#{number} 0 obj\n#{object}\nendobj\n"
      offset
    end

    xref_offset = pdf.bytesize
    pdf << "xref\n0 #{objects.length + 1}\n"
    pdf << "0000000000 65535 f \n"
    offsets.each { |offset| pdf << "#{offset.to_s.rjust(10, "0")} 00000 n \n" }
    pdf << "trailer\n<< /Size #{objects.length + 1} /Root 1 0 R >>\n"
    pdf << "startxref\n#{xref_offset}\n%%EOF\n"
    pdf
  end

  def escape_pdf_text(text)
    text.gsub(/[\\()]/) { |character| "\\#{character}" }
  end
end
