export class ImgBBFileDto {
    /**
     * @param {Object} raw
     */
    constructor(raw = {}) {
        this.filename = raw.filename ?? '';
        this.name = raw.name ?? '';
        this.mime = raw.mime ?? '';
        this.extension = raw.extension ?? '';
        this.url = raw.url ?? '';
    }
}

export class ImgBBDataDto {
    /**
     * @param {Object} raw
     */
    constructor(raw = {}) {
        this.id = raw.id ?? '';
        this.title = raw.title ?? '';
        this.url_viewer = raw.url_viewer ?? '';
        this.url = raw.url ?? '';
        this.display_url = raw.display_url ?? '';
        this.width = raw.width ?? '0';
        this.height = raw.height ?? '0';
        this.size = raw.size ?? '0';
        this.time = raw.time ?? '0';
        this.expiration = raw.expiration ?? '0';
        this.image = new ImgBBFileDto(raw.image);
        this.thumb = new ImgBBFileDto(raw.thumb);
        this.medium = new ImgBBFileDto(raw.medium);
        this.delete_url = raw.delete_url ?? '';
    }
}

export class ImgBBResponseDto {
    /**
     * @param {Object} raw
     */
    constructor(raw = {}) {
        this.data = new ImgBBDataDto(raw.data);
        this.success = Boolean(raw.success);
        this.status = Number(raw.status ?? 0);
    }
}
