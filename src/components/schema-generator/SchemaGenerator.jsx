"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  FileJson,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  Copy,
  Download,
} from "lucide-react";

// Schema definitions
const SCHEMA_DEFINITIONS = {
  BlogPosting: {
    name: "Blog Posting",
    description: "Schema for blog posts and articles",
    required: ["headline", "author", "datePublished"],
    fields: {
      headline: {
        type: "text",
        label: "Headline",
        placeholder: "Article title",
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Brief description of the article",
      },
      author: {
        type: "object",
        label: "Author",
        fields: {
          name: { type: "text", label: "Name", required: true },
          url: { type: "url", label: "Author URL" },
          sameAs: { type: "array", label: "Social Profiles", itemType: "url" },
        },
      },
      datePublished: { type: "date", label: "Publish Date", required: true },
      dateModified: { type: "date", label: "Modified Date" },
      image: { type: "array", label: "Images", itemType: "url" },
      publisher: {
        type: "object",
        label: "Publisher",
        fields: {
          name: { type: "text", label: "Name", required: true },
          logo: {
            type: "object",
            label: "Logo",
            fields: {
              url: { type: "url", label: "Logo URL", required: true },
            },
          },
        },
      },
      mainEntityOfPage: { type: "url", label: "Canonical URL" },
      keywords: { type: "array", label: "Keywords", itemType: "text" },
    },
  },

  WebApplication: {
    name: "Web Application",
    description: "Schema for web applications and software",
    required: ["name", "url"],
    fields: {
      name: { type: "text", label: "Application Name", required: true },
      description: { type: "textarea", label: "Description" },
      url: { type: "url", label: "Application URL", required: true },
      applicationCategory: {
        type: "select",
        label: "Category",
        options: [
          "BusinessApplication",
          "DeveloperApplication",
          "EntertainmentApplication",
          "FinanceApplication",
          "GameApplication",
          "HealthApplication",
          "LifestyleApplication",
          "ProductivityApplication",
          "SocialNetworkingApplication",
          "TravelApplication",
          "UtilitiesApplication",
        ],
      },
      operatingSystem: { type: "text", label: "Operating System" },
      softwareVersion: { type: "text", label: "Version" },
      author: {
        type: "object",
        label: "Author",
        fields: {
          name: { type: "text", label: "Name", required: true },
        },
      },
      offers: {
        type: "array",
        label: "Offers",
        itemType: "object",
        itemFields: {
          price: { type: "text", label: "Price" },
          priceCurrency: {
            type: "text",
            label: "Currency",
            placeholder: "USD",
          },
          availability: {
            type: "select",
            label: "Availability",
            options: ["InStock", "OutOfStock", "PreOrder", "Discontinued"],
          },
        },
      },
      aggregateRating: {
        type: "object",
        label: "Rating",
        fields: {
          ratingValue: {
            type: "number",
            label: "Rating (1-5)",
            min: 1,
            max: 5,
          },
          ratingCount: { type: "number", label: "Total Ratings" },
          bestRating: { type: "number", label: "Best Rating", value: 5 },
          worstRating: { type: "number", label: "Worst Rating", value: 1 },
        },
      },
    },
  },

  Organization: {
    name: "Organization",
    description: "Schema for businesses and organizations",
    required: ["name"],
    fields: {
      name: { type: "text", label: "Organization Name", required: true },
      description: { type: "textarea", label: "Description" },
      url: { type: "url", label: "Website URL" },
      logo: { type: "url", label: "Logo URL" },
      sameAs: { type: "array", label: "Social Profiles", itemType: "url" },
      contactPoint: {
        type: "array",
        label: "Contact Information",
        itemType: "object",
        itemFields: {
          telephone: { type: "tel", label: "Phone" },
          email: { type: "email", label: "Email" },
          contactType: {
            type: "select",
            label: "Contact Type",
            options: [
              "customer service",
              "technical support",
              "billing support",
              "sales",
            ],
          },
        },
      },
      address: {
        type: "object",
        label: "Address",
        fields: {
          streetAddress: { type: "text", label: "Street Address" },
          addressLocality: { type: "text", label: "City" },
          addressRegion: { type: "text", label: "State/Province" },
          postalCode: { type: "text", label: "Postal Code" },
          addressCountry: { type: "text", label: "Country" },
        },
      },
      foundingDate: { type: "date", label: "Founding Date" },
      numberOfEmployees: { type: "number", label: "Number of Employees" },
    },
  },

  Product: {
    name: "Product",
    description: "Schema for products and services",
    required: ["name"],
    fields: {
      name: { type: "text", label: "Product Name", required: true },
      description: { type: "textarea", label: "Description" },
      image: { type: "array", label: "Product Images", itemType: "url" },
      brand: {
        type: "object",
        label: "Brand",
        fields: {
          name: { type: "text", label: "Brand Name", required: true },
        },
      },
      offers: {
        type: "array",
        label: "Offers",
        itemType: "object",
        itemFields: {
          price: { type: "text", label: "Price" },
          priceCurrency: {
            type: "text",
            label: "Currency",
            placeholder: "USD",
          },
          availability: {
            type: "select",
            label: "Availability",
            options: ["InStock", "OutOfStock", "PreOrder", "Discontinued"],
          },
          url: { type: "url", label: "Purchase URL" },
        },
      },
      aggregateRating: {
        type: "object",
        label: "Rating",
        fields: {
          ratingValue: {
            type: "number",
            label: "Rating (1-5)",
            min: 1,
            max: 5,
          },
          ratingCount: { type: "number", label: "Total Ratings" },
          bestRating: { type: "number", label: "Best Rating", value: 5 },
          worstRating: { type: "number", label: "Worst Rating", value: 1 },
        },
      },
      review: {
        type: "array",
        label: "Reviews",
        itemType: "object",
        itemFields: {
          author: { type: "text", label: "Reviewer Name", required: true },
          reviewRating: {
            type: "number",
            label: "Rating (1-5)",
            min: 1,
            max: 5,
            required: true,
          },
          reviewBody: { type: "textarea", label: "Review Text" },
        },
      },
    },
  },

  FAQPage: {
    name: "FAQ Page",
    description: "Schema for frequently asked questions pages",
    required: ["mainEntity"],
    fields: {
      mainEntity: {
        type: "array",
        label: "FAQ Items",
        required: true,
        itemType: "object",
        itemFields: {
          question: { type: "text", label: "Question", required: true },
          answer: { type: "textarea", label: "Answer", required: true },
        },
      },
    },
  },

  Event: {
    name: "Event",
    description: "Schema for events and gatherings",
    required: ["name", "startDate"],
    fields: {
      name: { type: "text", label: "Event Name", required: true },
      description: { type: "textarea", label: "Description" },
      startDate: {
        type: "datetime-local",
        label: "Start Date & Time",
        required: true,
      },
      endDate: { type: "datetime-local", label: "End Date & Time" },
      eventStatus: {
        type: "select",
        label: "Event Status",
        options: [
          "EventScheduled",
          "EventPostponed",
          "EventCancelled",
          "EventMovedOnline",
        ],
      },
      eventAttendanceMode: {
        type: "select",
        label: "Attendance Mode",
        options: [
          "OfflineEventAttendanceMode",
          "OnlineEventAttendanceMode",
          "MixedEventAttendanceMode",
        ],
      },
      location: {
        type: "object",
        label: "Location",
        fields: {
          name: { type: "text", label: "Venue Name" },
          address: {
            type: "object",
            label: "Address",
            fields: {
              streetAddress: { type: "text", label: "Street Address" },
              addressLocality: { type: "text", label: "City" },
              addressRegion: { type: "text", label: "State/Province" },
              postalCode: { type: "text", label: "Postal Code" },
              addressCountry: { type: "text", label: "Country" },
            },
          },
        },
      },
      organizer: {
        type: "object",
        label: "Organizer",
        fields: {
          name: { type: "text", label: "Organizer Name", required: true },
          url: { type: "url", label: "Organizer Website" },
        },
      },
      offers: {
        type: "array",
        label: "Tickets/Offers",
        itemType: "object",
        itemFields: {
          name: { type: "text", label: "Ticket Type" },
          price: { type: "text", label: "Price" },
          priceCurrency: {
            type: "text",
            label: "Currency",
            placeholder: "USD",
          },
          availability: {
            type: "select",
            label: "Availability",
            options: ["InStock", "OutOfStock", "PreOrder", "Discontinued"],
          },
          url: { type: "url", label: "Purchase URL" },
        },
      },
    },
  },

  LocalBusiness: {
    name: "Local Business",
    description: "Schema for local businesses and services",
    required: ["name"],
    fields: {
      name: { type: "text", label: "Business Name", required: true },
      description: { type: "textarea", label: "Description" },
      url: { type: "url", label: "Website URL" },
      telephone: { type: "tel", label: "Phone Number" },
      email: { type: "email", label: "Email Address" },
      address: {
        type: "object",
        label: "Address",
        fields: {
          streetAddress: { type: "text", label: "Street Address" },
          addressLocality: { type: "text", label: "City" },
          addressRegion: { type: "text", label: "State/Province" },
          postalCode: { type: "text", label: "Postal Code" },
          addressCountry: { type: "text", label: "Country" },
        },
      },
      geo: {
        type: "object",
        label: "Geographic Coordinates",
        fields: {
          latitude: { type: "number", label: "Latitude" },
          longitude: { type: "number", label: "Longitude" },
        },
      },
      openingHours: {
        type: "array",
        label: "Opening Hours",
        itemType: "text",
        placeholder: "e.g., Mo-Fr 09:00-17:00",
      },
      priceRange: {
        type: "text",
        label: "Price Range",
        placeholder: "e.g., $$, $$$",
      },
      image: { type: "array", label: "Business Images", itemType: "url" },
      aggregateRating: {
        type: "object",
        label: "Rating",
        fields: {
          ratingValue: {
            type: "number",
            label: "Rating (1-5)",
            min: 1,
            max: 5,
          },
          ratingCount: { type: "number", label: "Total Ratings" },
          bestRating: { type: "number", label: "Best Rating", value: 5 },
          worstRating: { type: "number", label: "Worst Rating", value: 1 },
        },
      },
    },
  },
};

export default function SchemaGenerator() {
  const [selectedSchema, setSelectedSchema] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState("");

  // Reset form when schema changes
  useEffect(() => {
    setFormData({});
    setErrors({});
    setIsValid(false);
  }, [selectedSchema]);

  // Validate form
  useEffect(() => {
    if (!selectedSchema) return;

    const schemaDef = SCHEMA_DEFINITIONS[selectedSchema];
    const newErrors = {};
    let hasRequired = true;

    // Check required fields
    schemaDef.required.forEach((field) => {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        newErrors[field] = "This field is required";
        hasRequired = false;
      }
    });

    // Check nested required fields
    Object.entries(schemaDef.fields).forEach(([fieldKey, fieldDef]) => {
      if (fieldDef.type === "object" && fieldDef.fields) {
        Object.entries(fieldDef.fields).forEach(([nestedKey, nestedDef]) => {
          if (nestedDef.required && !formData[fieldKey]?.[nestedKey]) {
            newErrors[`${fieldKey}.${nestedKey}`] = "This field is required";
            hasRequired = false;
          }
        });
      }
    });

    setErrors(newErrors);
    setIsValid(hasRequired && Object.keys(newErrors).length === 0);
  }, [formData, selectedSchema]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parentField, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  const handleArrayAdd = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), {}],
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayItemChange = (field, index, itemField, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [itemField]: value } : item
      ),
    }));
  };

  const generateSchema = () => {
    if (!selectedSchema || !isValid) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": selectedSchema,
      ...formData,
    };

    // Clean up empty values
    const cleanSchema = JSON.parse(
      JSON.stringify(schema, (key, value) => {
        if (value === "" || value === null || value === undefined)
          return undefined;
        if (Array.isArray(value) && value.length === 0) return undefined;
        if (typeof value === "object" && Object.keys(value).length === 0)
          return undefined;
        return value;
      })
    );

    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(
      cleanSchema,
      null,
      2
    )}\n</script>`;

    setGeneratedSchema(jsonLd);
  };

  const renderField = (
    fieldKey,
    fieldDef,
    parentField = null,
    index = null
  ) => {
    const fullKey = parentField ? `${parentField}.${fieldKey}` : fieldKey;
    const value = parentField
      ? index !== null
        ? formData[parentField]?.[index]?.[fieldKey]
        : formData[parentField]?.[fieldKey]
      : formData[fieldKey];
    const error = errors[fullKey];

    const commonProps = {
      id: fullKey,
      value: value || "",
      onChange: (e) => {
        const newValue = e.target.value;
        if (parentField && index !== null) {
          handleArrayItemChange(parentField, index, fieldKey, newValue);
        } else if (parentField) {
          handleNestedChange(parentField, fieldKey, newValue);
        } else {
          handleInputChange(fieldKey, newValue);
        }
      },
      className: `w-full ${error ? "border-red-500" : ""}`,
      placeholder: fieldDef.placeholder,
    };

    switch (fieldDef.type) {
      case "text":
      case "url":
      case "email":
      case "tel":
        return (
          <Input
            {...commonProps}
            type={fieldDef.type}
            min={fieldDef.min}
            max={fieldDef.max}
          />
        );

      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            min={fieldDef.min}
            max={fieldDef.max}
          />
        );

      case "date":
        return <Input {...commonProps} type="date" />;

      case "datetime-local":
        return <Input {...commonProps} type="datetime-local" />;

      case "textarea":
        return <Textarea {...commonProps} rows={3} />;

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(newValue) => {
              if (parentField && index !== null) {
                handleArrayItemChange(parentField, index, fieldKey, newValue);
              } else if (parentField) {
                handleNestedChange(parentField, fieldKey, newValue);
              } else {
                handleInputChange(fieldKey, newValue);
              }
            }}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue
                placeholder={`Select ${fieldDef.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {fieldDef.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  const renderObjectField = (fieldKey, fieldDef) => {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium text-sm">{fieldDef.label}</h4>
        <div className="grid gap-4">
          {Object.entries(fieldDef.fields).map(([nestedKey, nestedDef]) => (
            <div key={nestedKey}>
              <Label
                htmlFor={`${fieldKey}.${nestedKey}`}
                className="text-sm font-medium"
              >
                {nestedDef.label}
                {nestedDef.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              {renderField(nestedKey, nestedDef, fieldKey)}
              {errors[`${fieldKey}.${nestedKey}`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${fieldKey}.${nestedKey}`]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderArrayField = (fieldKey, fieldDef) => {
    const items = formData[fieldKey] || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {fieldDef.label}
            {fieldDef.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleArrayAdd(fieldKey)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        {items.length === 0 && fieldDef.required && (
          <p className="text-red-500 text-xs">At least one item is required</p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 p-4 border rounded-lg bg-gray-50"
          >
            <div className="flex-1 space-y-3">
              {fieldDef.itemType === "object"
                ? Object.entries(fieldDef.itemFields).map(
                    ([itemKey, itemDef]) => (
                      <div key={itemKey}>
                        <Label className="text-sm font-medium">
                          {itemDef.label}
                          {itemDef.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        {renderField(itemKey, itemDef, fieldKey, index)}
                      </div>
                    )
                  )
                : renderField(
                    "value",
                    {
                      type: fieldDef.itemType,
                      label: fieldDef.label,
                      placeholder: fieldDef.placeholder,
                    },
                    fieldKey,
                    index
                  )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayRemove(fieldKey, index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Schema Generator</CardTitle>
          <CardDescription>
            Select a schema type and fill in the required fields to generate
            JSON-LD structured data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Schema Type Selection */}
        <div>
          <Label htmlFor="schema-type" className="text-sm font-medium">
            Schema Type <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedSchema} onValueChange={setSelectedSchema}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a schema type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SCHEMA_DEFINITIONS).map(([key, def]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <span>{def.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {def.required.length} required
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schema Description */}
        {selectedSchema && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {SCHEMA_DEFINITIONS[selectedSchema].description}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Fields */}
        {selectedSchema && (
          <div className="space-y-6">
            {Object.entries(SCHEMA_DEFINITIONS[selectedSchema].fields).map(
              ([fieldKey, fieldDef]) => (
                <div key={fieldKey}>
                  {fieldDef.type === "object" ? (
                    renderObjectField(fieldKey, fieldDef)
                  ) : fieldDef.type === "array" ? (
                    renderArrayField(fieldKey, fieldDef)
                  ) : (
                    <div>
                      <Label htmlFor={fieldKey} className="text-sm font-medium">
                        {fieldDef.label}
                        {fieldDef.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      {renderField(fieldKey, fieldDef)}
                      {errors[fieldKey] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[fieldKey]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Generate Button */}
        {selectedSchema && (
          <div className="pt-4 border-t">
            <Button
              onClick={generateSchema}
              disabled={!isValid}
              className="w-full"
              size="lg"
            >
              {isValid ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Generate JSON-LD Schema
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Fill Required Fields
                </>
              )}
            </Button>
            {!isValid && (
              <p className="text-red-500 text-xs mt-2 text-center">
                Please fill in all required fields marked with *
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>

    {/* Output Section */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileJson className="h-5 w-5 mr-2" />
          Generated JSON-LD
        </CardTitle>
        <CardDescription>
          Copy this structured data to your website's &lt;head&gt; section or use the download button.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedSchema ? (
          <div className="space-y-4">
            <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {generatedSchema}
              </pre>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(generatedSchema)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON-LD
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([generatedSchema], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'schema.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileJson className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a schema type and fill in the form to generate JSON-LD</p>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
  );
}
