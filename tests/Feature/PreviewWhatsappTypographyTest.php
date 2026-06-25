<?php

test('whatsapp previews declare their typography platform at the entry point', function () {
    $designsPath = base_path('resources/js/evidence-generator/features/preview/designs');

    $mobile1 = file_get_contents($designsPath.'/mobile-1/whatsapp/PreviewMobile1Whatsapp.tsx');
    $mobile2 = file_get_contents($designsPath.'/mobile-2/whatsapp/PreviewMobile2Whatsapp.tsx');
    $mobile3 = file_get_contents($designsPath.'/mobile-3/whatsapp/PreviewMobile1Whatsapp.tsx');
    $desktop = file_get_contents($designsPath.'/whatsapp-desktop/PreviewWhatsappDesktop.tsx');
    $typography = file_get_contents($designsPath.'/whatsappTypography.ts');
    $appCss = file_get_contents(base_path('resources/css/app.css'));
    $segoeCss = file_get_contents(base_path('resources/css/fonts/segoe-ui/stylesheet.css'));

    expect($typography)->toContain("type WhatsappTypographyPlatform = 'android' | 'ios' | 'windows';");
    expect($mobile1)->toContain("const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';");
    expect($mobile1)->toContain('data-whatsapp-platform={whatsappTypographyPlatform}');
    expect($mobile2)->toContain("const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';");
    expect($mobile2)->toContain('data-whatsapp-platform={whatsappTypographyPlatform}');
    expect($mobile3)->toContain("const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';");
    expect($mobile3)->toContain('data-whatsapp-platform={whatsappTypographyPlatform}');
    expect($desktop)->toContain("const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'windows';");
    expect($desktop)->toContain('data-whatsapp-platform={whatsappTypographyPlatform}');

    expect($appCss)->toContain("[data-whatsapp-platform='android']");
    expect($appCss)->toContain("[data-whatsapp-platform='ios']");
    expect($appCss)->toContain("[data-whatsapp-platform='windows']");
    expect($appCss)->toContain('--whatsapp-font-family');
    expect($appCss)->toContain('font-family: var(--whatsapp-font-family);');
    expect($appCss)->not->toContain('.segoe-ui');

    expect($segoeCss)->toContain("font-family: 'Segoe UI';");
    expect($segoeCss)->toContain('font-weight: 400;');
    expect($segoeCss)->toContain('font-weight: 600;');
    expect($segoeCss)->toContain('font-weight: 700;');
});

test('whatsapp typography is inherited from the preview platform except desktop message bubbles', function () {
    $designPaths = [
        base_path('resources/js/evidence-generator/features/preview/designs/mobile-1/whatsapp'),
        base_path('resources/js/evidence-generator/features/preview/designs/mobile-2/whatsapp'),
        base_path('resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp'),
        base_path('resources/js/evidence-generator/features/preview/designs/whatsapp-desktop'),
    ];

    foreach ($designPaths as $designPath) {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($designPath));

        foreach ($files as $file) {
            if (! $file->isFile() || ! in_array($file->getExtension(), ['ts', 'tsx'], true)) {
                continue;
            }

            $source = file_get_contents($file->getPathname());

            expect($source)->not->toContain('whatsapp-android');
            expect($source)->not->toContain('whatsapp-ios');
            expect($source)->not->toContain('segoe-ui');

            if ($file->getFilename() === 'WhatsappDesktopTextBubble.tsx') {
                expect($source)->toContain('whatsapp-windows');

                continue;
            }

            expect($source)->not->toContain('whatsapp-windows');
        }
    }
});
