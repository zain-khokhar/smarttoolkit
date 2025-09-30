import SchemaGenerator from '@/components/schema-generator/SchemaGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Code,
    FileJson,
    Copy,
    Download,
    Zap,
    Globe,
    Building,
    Package,
    HelpCircle,
    Calendar,
    MapPin
} from 'lucide-react';

export const metadata = {
    title: 'Schema Generator - Create JSON-LD Structured Data for SEO | Smart Toolkit',
    description: 'Generate structured data (JSON-LD) for SEO and rich snippets. Support for BlogPosting, WebApplication, Organization, Product, FAQPage, Event, and LocalBusiness schemas.',
    keywords: 'schema generator, JSON-LD, structured data, SEO, rich snippets, schema.org, blog posting, web application, organization, product, FAQ, event, local business',
    openGraph: {
        title: 'Schema Generator - JSON-LD Structured Data Tool',
        description: 'Create valid JSON-LD structured data for better SEO and rich search results. Supports 7+ schema types with real-time validation.',
        type: 'website',
        url: 'https://smarttoolkit.online/schema-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Schema Generator - JSON-LD Tool',
        description: 'Generate structured data for SEO with our easy-to-use schema generator tool.',
    },
};

export default function SchemaGeneratorPage() {
    const schemaTypes = [
        { id: 'BlogPosting', name: 'Blog Post', icon: FileJson, description: 'Article or blog post schema' },
        { id: 'WebApplication', name: 'Web App', icon: Code, description: 'Web application schema' },
        { id: 'Organization', name: 'Organization', icon: Building, description: 'Business or organization schema' },
        { id: 'Product', name: 'Product', icon: Package, description: 'Product or service schema' },
        { id: 'FAQPage', name: 'FAQ Page', icon: HelpCircle, description: 'Frequently asked questions schema' },
        { id: 'Event', name: 'Event', icon: Calendar, description: 'Event schema' },
        { id: 'LocalBusiness', name: 'Local Business', icon: MapPin, description: 'Local business schema' },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "Schema Generator",
                        "description": "Generate structured data (JSON-LD) for SEO and rich snippets. Supports BlogPosting, WebApplication, Organization, Product, FAQPage, Event, and LocalBusiness schemas.",
                        "url": "https://smarttoolkit.online/schema-generator",
                        "applicationCategory": "DeveloperApplication",
                        "operatingSystem": "Web Browser",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "creator": {
                            "@type": "Organization",
                            "name": "Smart Toolkit"
                        },
                        "featureList": [
                            "Real-time JSON-LD validation",
                            "7 schema types support",
                            "Copy and download functionality",
                            "SEO optimized output"
                        ]
                    })
                }}
            />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Schema Generator
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Generate structured data (JSON-LD) for SEO and rich snippets. Choose a schema type and fill in the details to create valid structured markup.
                </p>

                {/* Schema Types Overview */}
              

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-green-100 text-green-800">
                        <Zap className="h-3 w-3 mr-1" />
                        Real-time Validation
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                        <Code className="h-3 w-3 mr-1" />
                        JSON-LD Output
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                        <Copy className="h-3 w-3 mr-1" />
                        Copy & Download
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                        <Globe className="h-3 w-3 mr-1" />
                        SEO Optimized
                    </Badge>
                </div>
            </div>

            {/* Main Generator */}
            <SchemaGenerator />

            {/* Usage Instructions */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>How to Use</CardTitle>
                    <CardDescription>
                        Add the generated JSON-LD to improve your website's SEO and enable rich snippets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">1. Generate Schema</h4>
                                <p className="text-sm text-gray-600">
                                    Choose your content type, fill in the required fields, and click "Generate Schema".
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">2. Copy JSON-LD</h4>
                                <p className="text-sm text-gray-600">
                                    Copy the generated JSON-LD code from the output panel.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">3. Add to Website</h4>
                                <p className="text-sm text-gray-600">
                                    Paste the code in your HTML's &lt;head&gt; section or use a CMS plugin.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">4. Test & Validate</h4>
                                <p className="text-sm text-gray-600">
                                    Use Google's Rich Results Test to validate your structured data.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {schemaTypes.map((schema) => (
                        <Card key={schema.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <schema.icon className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <h3 className="font-semibold text-sm">{schema.name}</h3>
                                        <p className="text-xs text-gray-600">{schema.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
