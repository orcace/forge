export interface UrlEncoderInput {
  value: string;
}

export type UrlMode = "encode" | "decode";
export type UrlStrategy = "component" | "full-url" | "form";

export interface UrlEncoderOptions {
  decodePlus: boolean;
  encodeSpaceAsPlus: boolean;
  strategy: UrlStrategy;
}

export interface UrlPart {
  label: string;
  value: string;
}

export interface QueryParam {
  key: string;
  value: string;
}

export interface UrlStats {
  chars: number;
  params: number;
}

export interface UrlEncoderResult {
  error?: string;
  parts: UrlPart[];
  queryParams: QueryParam[];
  stats: UrlStats;
  value: string;
}

const defaultOptions: UrlEncoderOptions = {
  decodePlus: true,
  encodeSpaceAsPlus: false,
  strategy: "component",
};

export function normalizeUrlEncoderInput(input: string): string {
  return input.trim();
}

export function hasUrlEncoderInput(input: string): boolean {
  return normalizeUrlEncoderInput(input).length > 0;
}

export function transformUrl(
  input: string,
  mode: UrlMode,
  options: Partial<UrlEncoderOptions> = {},
): UrlEncoderResult {
  const mergedOptions = { ...defaultOptions, ...options };

  if (!input) {
    return createUrlResult("");
  }

  try {
    const value =
      mode === "encode"
        ? encodeUrl(input, mergedOptions)
        : decodeUrl(input, mergedOptions);

    return createUrlResult(value);
  } catch (error) {
    return {
      ...createUrlResult(""),
      error:
        error instanceof Error
          ? error.message
          : "Input is not valid percent-encoded text.",
    };
  }
}

export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrlComponent(input: string): UrlEncoderResult {
  try {
    return createUrlResult(decodeURIComponent(input));
  } catch {
    return { ...createUrlResult(""), error: "Input is not valid percent-encoded text." };
  }
}

export function getUrlParts(input: string): UrlPart[] {
  try {
    const url = new URL(input);

    return [
      { label: "Protocol", value: url.protocol.replace(/:$/, "") },
      { label: "Host", value: url.host },
      { label: "Path", value: url.pathname },
      { label: "Query", value: url.search.replace(/^\?/, "") },
      { label: "Hash", value: url.hash.replace(/^#/, "") },
    ].filter((part) => part.value.length > 0);
  } catch {
    return [];
  }
}

export function getQueryParams(input: string): QueryParam[] {
  const query = getQueryText(input);

  if (!query) {
    return [];
  }

  return query
    .split("&")
    .filter(Boolean)
    .map((entry) => {
      const [rawKey = "", ...rawValue] = entry.split("=");

      return {
        key: safeDecode(rawKey.replaceAll("+", " ")),
        value: safeDecode(rawValue.join("=").replaceAll("+", " ")),
      };
    });
}

function encodeUrl(input: string, options: UrlEncoderOptions): string {
  if (options.strategy === "full-url") {
    return encodeFullUrl(input);
  }

  const encoded = encodeURIComponent(input);

  return options.strategy === "form" || options.encodeSpaceAsPlus
    ? encoded.replaceAll("%20", "+")
    : encoded;
}

function decodeUrl(input: string, options: UrlEncoderOptions): string {
  const normalized =
    options.strategy === "form" || options.decodePlus
      ? input.replaceAll("+", " ")
      : input;

  return decodeURIComponent(normalized);
}

function encodeFullUrl(input: string): string {
  try {
    const url = new URL(input);
    const encoded = new URL(url.toString());

    encoded.pathname = url.pathname
      .split("/")
      .map((segment) => encodeURIComponent(decodeMaybe(segment)))
      .join("/");
    encoded.search = buildEncodedSearch(url.searchParams);
    encoded.hash = url.hash
      ? `#${encodeURIComponent(decodeMaybe(url.hash.slice(1)))}`
      : "";

    return encoded.toString();
  } catch {
    return encodeURIComponent(input);
  }
}

function buildEncodedSearch(params: URLSearchParams): string {
  const entries = Array.from(params.entries());

  if (entries.length === 0) {
    return "";
  }

  return `?${entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")}`;
}

function createUrlResult(value: string): UrlEncoderResult {
  const queryParams = getQueryParams(value);

  return {
    parts: getUrlParts(value),
    queryParams,
    stats: {
      chars: value.length,
      params: queryParams.length,
    },
    value,
  };
}

function getQueryText(input: string): string {
  try {
    return new URL(input).search.replace(/^\?/, "");
  } catch {
    const queryIndex = input.indexOf("?");

    if (queryIndex >= 0) {
      return input.slice(queryIndex + 1).split("#")[0] ?? "";
    }

    return input.includes("=") ? input.replace(/^\?/, "") : "";
  }
}

function decodeMaybe(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

function safeDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}
