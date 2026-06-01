import AppKit
import Foundation

func plainText(from markdown: String) -> String {
  var text = markdown.replacingOccurrences(of: "\r\n", with: "\n")
  if text.hasPrefix("---\n"), let end = text.range(of: "\n---", range: text.index(text.startIndex, offsetBy: 4)..<text.endIndex) {
    text = String(text[end.upperBound...])
  }

  let lines = text.split(separator: "\n", omittingEmptySubsequences: false).map(String.init)
  return lines.map { line in
    if line.hasPrefix("# ") {
      return line.replacingOccurrences(of: "# ", with: "")
    }
    if line.hasPrefix("## ") {
      return "\n" + line.replacingOccurrences(of: "## ", with: "")
    }
    if line.hasPrefix("### ") {
      return "\n" + line.replacingOccurrences(of: "### ", with: "")
    }
    if line.hasPrefix("- ") {
      return "• " + line.dropFirst(2)
    }
    return line
  }.joined(separator: "\n")
}

struct PdfTemplate {
  let margin: CGFloat
  let fontSize: CGFloat
  let lineSpacing: CGFloat
  let paragraphSpacing: CGFloat
}

func templateSettings(_ value: String) -> PdfTemplate {
  switch value {
  case "essay":
    return PdfTemplate(margin: 64, fontSize: 13, lineSpacing: 6, paragraphSpacing: 11)
  case "compact":
    return PdfTemplate(margin: 42, fontSize: 10.5, lineSpacing: 2, paragraphSpacing: 6)
  default:
    return PdfTemplate(margin: 54, fontSize: 12, lineSpacing: 4, paragraphSpacing: 9)
  }
}

if CommandLine.arguments.count < 3 {
  fputs("Usage: markdown_to_pdf.swift input.md output.pdf [template]\n", stderr)
  exit(64)
}

let inputPath = CommandLine.arguments[1]
let outputPath = CommandLine.arguments[2]
let template = templateSettings(CommandLine.arguments.count >= 4 ? CommandLine.arguments[3] : "manuscript")
let markdown = try String(contentsOfFile: inputPath, encoding: .utf8)
let text = plainText(from: markdown)

let pageSize = NSSize(width: 595.2, height: 841.8)
let margin = template.margin
let contentWidth = pageSize.width - margin * 2

let paragraph = NSMutableParagraphStyle()
paragraph.lineSpacing = template.lineSpacing
paragraph.paragraphSpacing = template.paragraphSpacing

let attributes: [NSAttributedString.Key: Any] = [
  .font: NSFont.systemFont(ofSize: template.fontSize),
  .foregroundColor: NSColor.black,
  .paragraphStyle: paragraph,
]

let textView = NSTextView(frame: NSRect(x: 0, y: 0, width: contentWidth, height: 10_000))
textView.isEditable = false
textView.isRichText = true
textView.isHorizontallyResizable = false
textView.isVerticallyResizable = true
textView.textContainer?.containerSize = NSSize(width: contentWidth, height: CGFloat.greatestFiniteMagnitude)
textView.textContainer?.widthTracksTextView = true
textView.textStorage?.setAttributedString(NSAttributedString(string: text, attributes: attributes))
textView.sizeToFit()

let printInfo = NSPrintInfo()
printInfo.paperSize = pageSize
printInfo.leftMargin = margin
printInfo.rightMargin = margin
printInfo.topMargin = margin
printInfo.bottomMargin = margin
printInfo.horizontalPagination = .fit
printInfo.verticalPagination = .automatic
printInfo.isHorizontallyCentered = false
printInfo.isVerticallyCentered = false
printInfo.jobDisposition = .save
printInfo.dictionary()[NSPrintInfo.AttributeKey.jobSavingURL] = URL(fileURLWithPath: outputPath)

let operation = NSPrintOperation(view: textView, printInfo: printInfo)
operation.showsPrintPanel = false
operation.showsProgressPanel = false

if !operation.run() {
  fputs("PDF export failed\n", stderr)
  exit(1)
}
