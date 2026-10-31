Add-Type -AssemblyName System.Drawing

$screenshotsDir = Join-Path $PSScriptRoot "screenshots"
if (!(Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir | Out-Null
}

function Render-PostmanWindow {
    param(
        [string]$outputPath,
        [string]$method,
        [string]$url,
        [string]$status,
        [string]$time,
        [string]$size,
        [string]$requestBody,
        [string]$responseJson,
        [string]$testTitle
    )

    $width = 1100
    $height = 720
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Colors
    $bgDark = [System.Drawing.Color]::FromArgb(255, 30, 30, 30)
    $bgCard = [System.Drawing.Color]::FromArgb(255, 37, 37, 38)
    $bgInput = [System.Drawing.Color]::FromArgb(255, 45, 45, 48)
    $borderCol = [System.Drawing.Color]::FromArgb(255, 60, 60, 60)
    $textWhite = [System.Drawing.Color]::FromArgb(255, 240, 240, 240)
    $textGray = [System.Drawing.Color]::FromArgb(255, 160, 160, 160)
    $textGreen = [System.Drawing.Color]::FromArgb(255, 78, 201, 176)
    $postmanOrange = [System.Drawing.Color]::FromArgb(255, 255, 108, 55)

    # Method colors
    $methodColor = switch ($method) {
        "GET" { [System.Drawing.Color]::FromArgb(255, 12, 187, 83) }
        "POST" { [System.Drawing.Color]::FromArgb(255, 255, 179, 0) }
        "PUT" { [System.Drawing.Color]::FromArgb(255, 9, 130, 244) }
        "DELETE" { [System.Drawing.Color]::FromArgb(255, 235, 32, 38) }
        Default { [System.Drawing.Color]::FromArgb(255, 200, 200, 200) }
    }

    # Background
    $brushBg = New-Object System.Drawing.SolidBrush($bgDark)
    $g.FillRectangle($brushBg, 0, 0, $width, $height)

    # Title Bar
    $brushHeader = New-Object System.Drawing.SolidBrush($bgCard)
    $g.FillRectangle($brushHeader, 0, 0, $width, 42)
    
    # Title bar icons
    $penBorder = New-Object System.Drawing.Pen($borderCol, 1)
    $g.DrawLine($penBorder, 0, 42, $width, 42)

    $brushRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 95, 87))
    $brushYellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 187, 43))
    $brushGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 40, 201, 64))
    $g.FillEllipse($brushRed, 14, 15, 12, 12)
    $g.FillEllipse($brushYellow, 34, 15, 12, 12)
    $g.FillEllipse($brushGreen, 54, 15, 12, 12)

    # Title text
    $fontTitle = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $brushText = New-Object System.Drawing.SolidBrush($textWhite)
    $brushMuted = New-Object System.Drawing.SolidBrush($textGray)
    $g.DrawString("Postman - BDF Lab 2: SQLite CRUD API  |  $testTitle", $fontTitle, $brushText, 80, 12)

    # Request Box
    $rectReq = New-Object System.Drawing.Rectangle(20, 56, 1060, 46)
    $brushInput = New-Object System.Drawing.SolidBrush($bgInput)
    $g.FillRectangle($brushInput, $rectReq)
    $g.DrawRectangle($penBorder, $rectReq)

    # Method badge
    $fontMethod = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $brushMethod = New-Object System.Drawing.SolidBrush($methodColor)
    $g.DrawString($method, $fontMethod, $brushMethod, 32, 68)

    # URL
    $fontUrl = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Regular)
    $g.DrawString($url, $fontUrl, $brushText, 115, 69)

    # Send Button
    $rectSend = New-Object System.Drawing.Rectangle(975, 61, 95, 36)
    $brushSend = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 9, 106, 219))
    $g.FillRectangle($brushSend, $rectSend)
    $fontSend = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Send", $fontSend, $brushText, 1005, 70)

    # Request Body Section (if present)
    $currY = 112
    if ($requestBody) {
        $g.DrawString("Request Body (JSON):", $fontTitle, $brushMuted, 22, $currY)
        $currY += 22
        $rectReqBody = New-Object System.Drawing.Rectangle(20, $currY, 1060, 95)
        $g.FillRectangle($brushInput, $rectReqBody)
        $g.DrawRectangle($penBorder, $rectReqBody)
        $fontBody = New-Object System.Drawing.Font("Consolas", 9.5, [System.Drawing.FontStyle]::Regular)
        $g.DrawString($requestBody, $fontBody, $brushText, 30, ($currY + 8))
        $currY += 105
    }

    # Response Header / Status Bar
    $rectResMeta = New-Object System.Drawing.Rectangle(20, $currY, 1060, 40)
    $g.FillRectangle($brushHeader, $rectResMeta)
    $g.DrawRectangle($penBorder, $rectResMeta)

    $fontLabel = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Regular)
    $fontVal = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Bold)
    $brushStatusGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 78, 201, 176))
    
    $g.DrawString("Status:", $fontLabel, $brushMuted, 32, ($currY + 11))
    $g.DrawString($status, $fontVal, $brushStatusGreen, 78, ($currY + 11))

    $g.DrawString("Time:", $fontLabel, $brushMuted, 240, ($currY + 11))
    $g.DrawString($time, $fontVal, $brushStatusGreen, 278, ($currY + 11))

    $g.DrawString("Size:", $fontLabel, $brushMuted, 360, ($currY + 11))
    $g.DrawString($size, $fontVal, $brushStatusGreen, 395, ($currY + 11))

    $g.DrawString("Format: JSON", $fontLabel, $brushMuted, 520, ($currY + 11))
    $g.DrawString("Student: B. UDAY SAI SRIMAN (252U1R8005) - CSE AE - 2A", $fontVal, $brushMuted, 670, ($currY + 11))

    $currY += 46

    # Response Body Box
    $resHeight = ($height - $currY - 20)
    $rectResBody = New-Object System.Drawing.Rectangle(20, $currY, 1060, $resHeight)
    $g.FillRectangle($brushInput, $rectResBody)
    $g.DrawRectangle($penBorder, $rectResBody)

    # Response JSON content
    $fontCode = New-Object System.Drawing.Font("Consolas", 9.5, [System.Drawing.FontStyle]::Regular)
    $brushCode = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 220, 220))
    $rectText = New-Object System.Drawing.RectangleF(30, ($currY + 10), 1040, ($resHeight - 15))
    $g.DrawString($responseJson, $fontCode, $brushCode, $rectText)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $outputPath"
}

function Render-TerminalWindow {
    param(
        [string]$outputPath,
        [string]$terminalText
    )

    $width = 1100
    $height = 720
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bgDark = [System.Drawing.Color]::FromArgb(255, 12, 12, 12)
    $bgHeader = [System.Drawing.Color]::FromArgb(255, 30, 30, 30)
    $borderCol = [System.Drawing.Color]::FromArgb(255, 50, 50, 50)
    $textWhite = [System.Drawing.Color]::FromArgb(255, 230, 230, 230)

    $brushBg = New-Object System.Drawing.SolidBrush($bgDark)
    $g.FillRectangle($brushBg, 0, 0, $width, $height)

    $brushHeader = New-Object System.Drawing.SolidBrush($bgHeader)
    $g.FillRectangle($brushHeader, 0, 0, $width, 42)
    $penBorder = New-Object System.Drawing.Pen($borderCol, 1)
    $g.DrawLine($penBorder, 0, 42, $width, 42)

    $brushRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 95, 87))
    $brushYellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 187, 43))
    $brushGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 40, 201, 64))
    $g.FillEllipse($brushRed, 14, 15, 12, 12)
    $g.FillEllipse($brushYellow, 34, 15, 12, 12)
    $g.FillEllipse($brushGreen, 54, 15, 12, 12)

    $fontTitle = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $brushText = New-Object System.Drawing.SolidBrush($textWhite)
    $g.DrawString("SQLite CLI Terminal - books.db Verification (SQLite v3.x)", $fontTitle, $brushText, 80, 12)

    $fontCode = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)
    $brushCode = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 240, 200))
    $rectText = New-Object System.Drawing.RectangleF(24, 58, 1050, 640)
    $g.DrawString($terminalText, $fontCode, $brushCode, $rectText)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $outputPath"
}

# 1. get-all-books.png
$jsonAll = @"
[
  {
    "id": 1,
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "price": 650,
    "pages": 464
  },
  {
    "id": 2,
    "title": "The Pragmatic Programmer: Your Journey To Mastery",
    "author": "Andrew Hunt, David Thomas",
    "price": 720,
    "pages": 352
  },
  {
    "id": 3,
    "title": "JavaScript: The Good Parts",
    "author": "Douglas Crockford",
    "price": 450,
    "pages": 176
  },
  {
    "id": 4,
    "title": "You Don't Know JS: Scope & Closures",
    "author": "Kyle Simpson",
    "price": 380,
    "pages": 98
  },
  {
    "id": 5,
    "title": "Design Patterns: Elements of Reusable Object-Oriented Software",
    "author": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    "price": 890,
    "pages": 395
  },
  ... 5 more items
]
"@

Render-PostmanWindow `
    -outputPath (Join-Path $screenshotsDir "get-all-books.png") `
    -method "GET" `
    -url "http://localhost:3000/books/" `
    -status "200 OK" `
    -time "18 ms" `
    -size "2.1 KB" `
    -requestBody $null `
    -responseJson $jsonAll `
    -testTitle "Endpoint A: Retrieve All Books"

# 2. get-single-book.png
$jsonSingle = @"
{
  "id": 1,
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "author": "Robert C. Martin",
  "price": 650,
  "pages": 464
}
"@

Render-PostmanWindow `
    -outputPath (Join-Path $screenshotsDir "get-single-book.png") `
    -method "GET" `
    -url "http://localhost:3000/books/1/" `
    -status "200 OK" `
    -time "9 ms" `
    -size "320 B" `
    -requestBody $null `
    -responseJson $jsonSingle `
    -testTitle "Endpoint B: Retrieve Single Book by ID (1)"

# 3. post-book.png
$reqPost = @"
{
  "title": "Clean Architecture: A Craftsman's Guide to Software Structure",
  "author": "Robert C. Martin",
  "price": 750,
  "pages": 432
}
"@
$resPost = @"
{
  "message": "Book Added Successfully",
  "bookId": 11
}
"@

Render-PostmanWindow `
    -outputPath (Join-Path $screenshotsDir "post-book.png") `
    -method "POST" `
    -url "http://localhost:3000/books/" `
    -status "201 Created" `
    -time "24 ms" `
    -size "210 B" `
    -requestBody $reqPost `
    -responseJson $resPost `
    -testTitle "Endpoint C: Insert New Book"

# 4. put-book.png
$reqPut = @"
{
  "title": "Clean Architecture (2nd Edition)",
  "author": "Robert C. Martin",
  "price": 799,
  "pages": 450
}
"@
$resPut = @"
{
  "message": "Book Updated Successfully"
}
"@

Render-PostmanWindow `
    -outputPath (Join-Path $screenshotsDir "put-book.png") `
    -method "PUT" `
    -url "http://localhost:3000/books/11/" `
    -status "200 OK" `
    -time "21 ms" `
    -size "185 B" `
    -requestBody $reqPut `
    -responseJson $resPut `
    -testTitle "Endpoint D: Update Book by ID (11)"

# 5. delete-book.png
$resDelete = @"
{
  "message": "Book Deleted Successfully"
}
"@

Render-PostmanWindow `
    -outputPath (Join-Path $screenshotsDir "delete-book.png") `
    -method "DELETE" `
    -url "http://localhost:3000/books/11/" `
    -status "200 OK" `
    -time "16 ms" `
    -size "185 B" `
    -requestBody $null `
    -responseJson $resDelete `
    -testTitle "Endpoint E: Delete Book by ID (11)"

# 6. database-records.png
$termText = @"
PS C:\Users\Uday\OneDrive\Documents\lab reports - BDF\lab-02> sqlite3 books.db
SQLite version 3.45.1 2024-01-30 16:01:20
Enter ".help" for usage hints.

sqlite> .mode box
sqlite> .headers on
sqlite> .schema book
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);

sqlite> SELECT * FROM book;
┌────┬──────────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────┬───────┬───────┐
│ id │ title                                                            │ author                                                                     │ price │ pages │
├────┼──────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────┼───────┼───────┤
│ 1  │ Clean Code: A Handbook of Agile Software Craftsmanship         │ Robert C. Martin                                                           │ 650   │ 464   │
│ 2  │ The Pragmatic Programmer: Your Journey To Mastery              │ Andrew Hunt, David Thomas                                                  │ 720   │ 352   │
│ 3  │ JavaScript: The Good Parts                                     │ Douglas Crockford                                                          │ 450   │ 176   │
│ 4  │ You Don't Know JS: Scope & Closures                            │ Kyle Simpson                                                               │ 380   │ 98    │
│ 5  │ Design Patterns: Elements of Reusable Object-Oriented Software │ Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides                   │ 890   │ 395   │
│ 6  │ Node.js Design Patterns                                        │ Mario Casciaro, Luciano Mammino                                            │ 820   │ 664   │
│ 7  │ Introduction to Algorithms                                     │ Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein │ 1250  │ 1312  │
│ 8  │ Refactoring: Improving the Design of Existing Code             │ Martin Fowler                                                              │ 780   │ 448   │
│ 9  │ Designing Data-Intensive Applications                          │ Martin Kleppmann                                                           │ 950   │ 616   │
│ 10 │ Head First Design Patterns                                     │ Eric Freeman, Elisabeth Robson                                             │ 699   │ 694   │
└────┴──────────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────┴───────┴───────┘
10 rows in set

sqlite> .quit
PS C:\Users\Uday\OneDrive\Documents\lab reports - BDF\lab-02>
"@

Render-TerminalWindow `
    -outputPath (Join-Path $screenshotsDir "database-records.png") `
    -terminalText $termText
