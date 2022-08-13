import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/** 
 * Utility functions to create an image of an element that can be downloaded as an image (png or jpg) or pdf or copied to the clipboard.
 * ======================================================================
 * npm i html2canvas jspdf
 * ======================================================================
 * 
 * In the component where these functions are used:
 * 
 * 1) import the functions you need, e.g.
 * import { copyImage, downloadImage, downloadPdf } from '../utils/element2image'
 * 
 * 2) create a ref to reference the element, e.g.
 * const printRef = useRef<HTMLDivElement>(null)
 * 
 * 3) add the ref attribute to the element, e.g.
 * <div ref={printRef}> ... </div>
 * 
 * 4) create one or more buttons with handlers, e.g.
 * <button onClick={handleCopyImage}> ... </button>
 * <button onClick={handleDownloadImage}> ... </button>
 * <button onClick={handleDownloadPdf}> ... </button>
 * 
 * 5) define the handlers to call the imported functions, e.g.
 * const handleCopyImage = () => copyImage(printRef.current!)
 * const handleDownloadImage = () => downloadImage(printRef.current!, 'QRCode', 'png')
 * const handleDownloadPdf = () => downloadPdf(printRef.current!, 'QRCode')
 * 
 * */

/** Creates an image of an element and copies it to the clipboard
 * @param element - The element
*/
export const copyImage = async (element: HTMLElement) => {
  const canvas = await html2canvas(element)

  canvas.toBlob(function (blob) {
    const item = new ClipboardItem({ "image/png": blob! })
    navigator.clipboard.write([item])
  })
}

/** Creates an image of an element and downloads it as a png (default) or jpg file 
 * @param element - The element
 * @param fileName - Optional, the filename without extension (default 'image')
 * @param fileExtension - Optional, the extension can be 'png' or 'jpg' (default 'png')
*/
export const downloadImage = async (element: HTMLElement, fileName: string = 'image', fileExtension: 'png' | 'jpg' = 'png') => {
  const canvas = await html2canvas(element)

  const data = canvas.toDataURL(`image/${fileExtension}`)
  const link = document.createElement('a')

  if (typeof link.download === 'string') {
    link.href = data
    link.download = `${fileName}.${fileExtension}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    window.open(data)
  }
}

/** Creates an image of an element and downloads it as a pdf file 
 * @param element - The element
 * @param fileName - Optional, the filename without extension (default 'image')
*/
export const downloadPdf = async (element: HTMLElement, fileName: string = 'image') => {
  const canvas = await html2canvas(element!)
  const data = canvas.toDataURL('image/png')

  const pdf = new jsPDF()
  const imgProperties = pdf.getImageProperties(data)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

  pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(`${fileName}.pdf`)
}
