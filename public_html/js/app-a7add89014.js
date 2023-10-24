"use strict";
angular.module("croptool", ["LocalStorageModule", "ngSanitize", "ui.bootstrap", "angular-ladda", "pascalprecht.translate"]).config(["$translateProvider", function (r) {
	r.useSanitizeValueStrategy("escapeParameters"), r.useStaticFilesLoader({
		prefix: "locale/",
		suffix: ".json"
	}), r.useSanitizeValueStrategy("sceParameters"), r.preferredLanguage("en")
}]).service("LoginService", ["$http", "$rootScope", function (r, t) {
	var a = this;
	this.checkLogin = function (r) {
		var e = r.data;
		e.user ? a.user = {
			name: e.user
		} : a.user = void 0, a.loginResponse = e, "object" != typeof a.loginResponse && (a.loginResponse = {
			error: "The CropTool backend is currently having problems."
		}), a.loginResponse.code = r.status, t.$broadcast("loginStatusChanged", a.loginResponse)
	}, r.get("./api/auth/user").then(this.checkLogin, this.checkLogin)
}]).service("WindowService", ["$rootScope", "$window", function (r, e) {
	var t = e.outerWidth;
	angular.element(e).bind("resize", function () {
		r.$broadcast("windowWidthChanged", {
			oldValue: t,
			value: e.outerWidth
		}), t = e.outerWidth, r.$apply()
	})
}]).controller("LoginCtrl", ["$scope", "$http", "$httpParamSerializer", "LoginService", function (e, r, t, a) {
	e.user = a.user, e.ready = !1, e.oauthLogin = function () {
		window.location.href = "./api/auth/login?" + t(e.currentUrlParams)
	}, e.logout = function () {
		r.get("./api/auth/logout").then(function (r) {
			a.checkLogin(r.data), e.user = a.user
		})
	}, e.$on("loginStatusChanged", function () {
		if (e.user = a.user, e.ready = !0, a.loginResponse.error) {
			var r = 401 == a.loginResponse.code ? null : a.loginResponse.code + " " + a.loginResponse.error;
			e.oauthError = r
		}
		e.oauthWarnings = a.loginResponse.warnings
	})
}]).directive("ctCropper", ["$timeout", function (o) {
	return {
		scope: {
			onCrop: "&",
			aspectRatio: "@",
			rotation: "@"
		},
		link: function (i, r) {
			function e() {
				a(), i.cropper = new Cropper(r[0], {
					aspectRatio: i.aspectRatio,
					crop: t,
					viewMode: 2
				})
			}

			function t(r) {
				angular.isFunction(i.onCrop) && i.$applyAsync(function () {
					i.onCrop({
						$event: r
					})
				})
			}

			function a() {
				i.cropper && i.cropper.destroy()
			}
			r.on("load", function () {
				o(e)
			}), r.bind("$destroy", a), i.$watch("aspectRatio", function (r) {
				i.cropper && i.cropper.setAspectRatio(r)
			}), i.$watch("rotation", function (r) {
				if (i.cropper) {
					i.cropper.rotateTo(r);
					var e = i.cropper.getImageData(),
						t = i.cropper.getCanvasData(),
						a = Math.min(e.width / t.width, e.height / t.height);
					i.cropper.zoomTo(a);
					var o = i.cropper.getData();
					i.cropper.setData(o)
				}
			}), i.$on("crop-input-changed", function (r, e) {
				if (e && "object" == typeof e) {
					var t = i.cropper.getData();
					t.x = e.left, t.y = e.top, t.width = e.width, t.height = e.height, i.cropper.setData(t)
				}
			})
		}
	}
}]).controller("AppCtrl", ["$scope", "$http", "$timeout", "$q", "$window", "$httpParamSerializer", "LoginService", "localStorageService", "WindowService", function (i, n, r, e, t, c, a, o, s) {
	var l, p = !1,
		u = [1, 1],
		d = !1;

	function g(r, e) {
		r = r.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var t = new RegExp("[\\?&]" + r + "=([^&#]*)").exec(e || location.search);
		return null == t ? "" : decodeURIComponent(t[1].replace(/\+/g, " "))
	}

	function m() {
		var r = 0;
		if ("keep" == i.aspectratio) i.metadata && i.metadata.original && (r = i.metadata.original.width / i.metadata.original.height);
		else if ("fixed" == i.aspectratio) {
			var e = parseInt(i.aspectratio_cx),
				t = parseInt(i.aspectratio_cy);
			if (!e || e < 0 || !t || t < 0) return;
			r = i.aspectratio_cx / i.aspectratio_cy
		}
		return r
	}

	function h(r) {
		var e = r.title.match(/([a-z0-9.\-]+)\.(mdwiki.org|nccommons.org)\/wiki\/([^?]+)/),
			t = r.title.match(/([a-z0-9.\-]+)\.(mdwiki.org|nccommons.org)\/w\/index.php/),
			a = "?" + r.title.split("?")[1];
		e ? (r.site = e[1] + "." + e[2], r.title = e[3], r.page = g("page", a) || r.page) : t ? (r.site = t[1] + "." + t[2], r.title = g("title", a), r.page = g("page", a)) : (r.site = r.site || "nccommons.org", r.page = g("page", a) || r.page);
		try {
			r.title = decodeURIComponent(r.title)
		} catch (r) { }
		return r.title = r.title.replace(/_/g, " ").replace(/^[^:]+:/, ""), r.title.match(/\.(pdf|djvu|tiff?)$/) && !r.page && (r.page = 1), r
	}

	function f(a, o) {
		l && (l && l.resolve ? l.resolve() : r.cancel(l)), l = "" != o ? r(function () {
			l = e.defer(), n.get("./api/file/exists?" + c({
				site: a,
				title: o
			}), {
				timeout: l.promise
			}).then(function (r) {
				var e = r.data,
					t = a + ":" + o;
				i.error = e.error, e.error ? i.error = e.error : i.exists[t] = e.exists, l = null
			})
		}, 300) : null
	}
	i.currentUrlParams = {}, i.updateCoords = function (r) {
		if (d) d = !1;
		else {
			var e = [Math.round(r.width * u[0]), Math.round(r.height * u[1])],
				t = [Math.round(r.x * u[0]), Math.round(r.y * u[1])];
			i.metadata && (i.crop_dim = {
				x: t[0],
				y: t[1],
				w: e[0],
				h: e[1],
				right: i.metadata.original.width - t[0] - e[0],
				bottom: i.metadata.original.height - t[1] - e[1],
				rotate: r.rotate
			})
		}
	}, i.showNotice = !o.get("croptool-notice-4"), i.dismissNotice = function () {
		o.add("croptool-notice-4", "hide"), i.showNotice = !1
	}, i.back = function () {
		i.cropresults = void 0, i.error = ""
	}, i.pageChanged = function () {
		i.openFile()
	}, i.onCropDimChange = function (r) {
		var e = m();
		0 != e && ("w" == r ? i.crop_dim.h = Math.round(i.crop_dim.w / e) : "h" == r && (i.crop_dim.w = Math.round(i.crop_dim.h / e))), void 0 !== i.crop_dim.x && void 0 !== i.crop_dim.y && void 0 !== i.crop_dim.w && void 0 !== i.crop_dim.h && (d = !0, i.$broadcast("crop-input-changed", {
			left: i.crop_dim.x / u[0],
			top: i.crop_dim.y / u[1],
			width: i.crop_dim.w / u[0],
			height: i.crop_dim.h / u[1]
		}))
	}, i.$on("loginStatusChanged", function () {
		a.user, i.status = "", i.user = a.user
	}), i.locateBorder = function () {
		i.borderLocatorBusy || (i.borderLocatorBusy = !0, n.get("./api/file/autodetect?" + c({
			title: i.currentUrlParams.title,
			site: i.currentUrlParams.site,
			page: i.currentUrlParams.page
		})).then(function (r) {
			var e = r.data;
			i.borderLocatorBusy = !1, console.log(e);
			var t = e.area;
			i.$broadcast("crop-input-changed", {
				left: t[0] / u[0],
				top: t[1] / u[1],
				width: (t[2] - t[0]) / u[0],
				height: (t[3] - t[1]) / u[1]
			})
		}, function (r) {
			i.error = "An error occured: " + r.status + " " + r.data.error, i.borderLocatorBusy = !1
		}))
	}, i.cropMethodChanged = function () {
		for (o.set("croptool-cropmethod", i.cropmethod); i.rotation.angle < 0;) i.rotation.angle += 360;
		i.rotation.angle = 90 * Math.round(i.rotation.angle / 90)
	}, i.aspectRatioChanged = function () {
		var r = m();
		null !== r && (i.aspectratio_cxy = r, o.set("croptool-aspectratio", i.aspectratio), o.set("croptool-aspectratio-x", i.aspectratio_cx), o.set("croptool-aspectratio-y", i.aspectratio_cy))
	}, i.openFile = function (r) {
		if (!1 === r && (i.currentUrlParams = {
			site: g("site"),
			title: g("title"),
			page: g("page"),
			left: g("left"),
			top: g("top"),
			right: g("right"),
			bottom: g("bottom"),
			width: g("width"),
			height: g("height"),
			ratio: g("ratio")
		}), !1 !== r) {
			var e = c(i.currentUrlParams),
				t = location.href.split("?", 1)[0] + (e.length ? "?" + e : "");
			window.history.pushState(null, null, t), p = !0
		}
		if (i.error = "", i.newTitle = "", i.cropresults = null, i.uploadresults = null, !i.currentUrlParams.title) return i.metadata = null, void (i.currentUrlParams = {});
		i.currentUrlParams = h(i.currentUrlParams), i.currentUrlParams.page && (i.overwrite = "rename"), i.currentUrlParams.title && (i.error = "", i.busy = !0, i.crop_dim = void 0, i.rotation = {
			angle: 0
		}, n.get("./api/file/info?" + c({
			title: i.currentUrlParams.title,
			site: i.currentUrlParams.site,
			page: i.currentUrlParams.page
		})).then(function (r) {
			i.busy = !1;
			var t = r.data;
			if (t.error) return i.error = t.error, void (i.metadata = null);
			i.metadata = t, "" === i.currentUrlParams.left && "" === i.currentUrlParams.right && "" === i.currentUrlParams.ratio || setTimeout(function () {
				var r = {
					x: 0,
					y: 0,
					w: 100,
					h: 100
				};
				if ("" !== i.currentUrlParams.left && "" !== i.currentUrlParams.right ? (r.x = +i.currentUrlParams.left, r.w = t.original.width - i.currentUrlParams.right - i.currentUrlParams.left) : "" !== i.currentUrlParams.left ? (r.x = +i.currentUrlParams.left, r.w = +i.currentUrlParams.width) : "" !== i.currentUrlParams.right && (r.x = t.original.width - i.currentUrlParams.right - i.currentUrlParams.width, r.w = +i.currentUrlParams.width), "" !== i.currentUrlParams.top && "" !== i.currentUrlParams.bottom ? (r.y = +i.currentUrlParams.top, r.h = t.original.height - i.currentUrlParams.bottom - i.currentUrlParams.top) : "" !== i.currentUrlParams.top ? (r.y = +i.currentUrlParams.top, r.h = +i.currentUrlParams.height) : "" !== i.currentUrlParams.bottom && (r.y = t.original.height - i.currentUrlParams.bottom - i.currentUrlParams.top, r.h = +i.currentUrlParams.height), i.crop_dim = r, "" !== i.currentUrlParams.ratio && 2 == i.currentUrlParams.ratio.split(":").length) {
					var e = i.currentUrlParams.ratio.split(":");
					i.aspectratio = "fixed", i.aspectratio_cx = e[0], i.aspectratio_cy = e[1]
				} else i.aspectratio = i.currentUrlParams.ratio || "free";
				i.onCropDimChange(), i.aspectRatioChanged()
			}, 300), i.aspectRatioChanged(), i.availablePages = [];
			for (var e = 1; e <= i.metadata.pagecount; e++) i.availablePages.push(e);
			if (u = i.metadata.thumb ? [i.metadata.original.width / i.metadata.thumb.width, i.metadata.original.height / i.metadata.thumb.height] : [1, 1], !t.error) {
				var a = i.currentUrlParams.title.lastIndexOf(".");
				i.currentUrlParams.page && 1 < i.metadata.pagecount ? i.newTitle = i.currentUrlParams.title.substr(0, a) + " (page " + i.currentUrlParams.page + " crop).jpg" : i.newTitle = i.currentUrlParams.title.substr(0, a) + " (cropped)" + i.currentUrlParams.title.substr(a)
			}
		}, function (r) {
			i.metadata = null, i.error = r.data.error, i.busy = !1
		}))
	}, i.preview = function () {
		var para = {
			title: i.currentUrlParams.title,
			site: i.currentUrlParams.site,
			page: i.currentUrlParams.page,
			method: i.cropmethod,
			x: i.crop_dim.x,
			y: i.crop_dim.y,
			rotate: i.crop_dim.rotate,
			width: i.crop_dim.w,
			height: i.crop_dim.h
		};
		if (void 0 === i.crop_dim) return alert("Please select a crop region then press submit."), !1;
		i.error = "",
			i.allowIgnoreWarnings = !1,
			i.ignoreWarnings = !1,
			i.confirmOverwrite = !1,
			i.ladda = !0,
			n.get("./api/file/crop?" + c(para)).then(function (r) {

				document.getElementById("xid").value = para.x;
				document.getElementById("yid").value = para.y;
				document.getElementById("widthid").value = para.width;
				document.getElementById("heightid").value = para.height;

				var e = r.data;
				if (i.ladda = !1, (e.page.hasAssessmentTemplates || e.page.hasDoNotCropTemplate) && (i.overwrite = "rename"), (i.cropresults = e).page.elems.wikidata) {
					var t = e.page.elems["wikidata-item"],
						a = e.wikidata.labels.en;
					i.cropresults.wikidataLink = a ? '<a target="_blank" href="https://www.wikidata.org/wiki/' + t + '">' + a + " (" + t + ")</a>" : '<a target="_blank" href="https://www.wikidata.org/wiki/' + t + '">' + t + "</a>", i.overwrite = "rename"
				}
				i.updateUploadComment()
			}, function (r) {
				i.error = "[Error] " + r.data.error, i.ladda = !1
			})
	}, i.upload = function (a) {
		i.ladda2 = !0, i.error = "", i.allowIgnoreWarnings = !1;
		var r = {
			title: i.currentUrlParams.title,
			site: i.currentUrlParams.site,
			page: i.currentUrlParams.page,
			overwrite: i.overwrite,
			comment: i.uploadComment,
			filename: i.newTitle,
			elems: i.cropresults.page.elems,
			store: !0
		};
		(i.ignoreWarnings || i.confirmOverwrite) && (r.ignorewarnings = "1"), n.post("./api/file/publish", r).then(function (r) {
			var e = r.data;
			if (i.ladda2 = !1, "Success" === e.result) i.uploadresults = e;
			else if ("Warning" == e.result) {
				var t = Object.keys(e.warnings);
				i.allowIgnoreWarnings = -1 == t.indexOf("exists") && -1 == t.indexOf("page-exists"), 1 == t.length && "was-deleted" == t[0] ? a || (i.ignoreWarnings = !0, i.upload(!0)) : i.error = "Upload failed because of the following warning(s): " + t.join(", ") + "."
			} else i.error = "Upload failed! ", e.error && (i.error += e.error.info)
		}, function (r) {
			i.ladda2 = !1, i.error = "Upload failed! " + r.data.error
		})
	}, angular.element(t).bind("popstate", function (r) {
		p && i.$apply(function () {
			i.openFile(!1)
		})
	}), i.openFile(!1), i.status = "Checking login", i.cropmethod = o.get("croptool-cropmethod") || "precise", i.aspectratio = o.get("croptool-aspectratio") || "free", i.aspectratio_cx = o.get("croptool-aspectratio-x") || "16", i.aspectratio_cy = o.get("croptool-aspectratio-y") || "9", i.overwrite = o.get("croptool-overwrite") || "overwrite", i.rotation = {
		angle: 0
	}, i.aspectRatioChanged(), i.exists = [], i.$watch("titleInput", function () {
		if (i.titleInput) {
			var r = h({
				title: i.titleInput
			}),
				e = r.site + ":" + r.title;
			r.title && void 0 === i.exists[e] && i.title !== r.title && (i.error = "", f(r.site, r.title)), i.currentUrlParams = r
		}
	}), i.updateUploadComment = function () {
		console.log("UPDATE UPLAOD COMM", i.cropresults.page.elems), o.set("croptool-overwrite", i.overwrite);
		var r = "";
		"rename" == i.overwrite ? r += "[[:File:" + i.currentUrlParams.title + "]] cropped" : r += "Cropped", r += " " + i.cropresults.dim, i.cropresults.page.elems.border && (r += " Removed border."), i.cropresults.page.elems.trimming && (r += " Image was trimmed."), i.cropresults.page.elems.watermark && (r += " Removed watermark."), i.cropresults.page.elems.wikidata && (r += " Crop for [[:wikidata:" + i.cropresults.page.elems["wikidata-item"] + "|Wikidata]]."), i.uploadComment = r
	}, i.$watch("newTitle", function () {
		i.newTitle && void 0 === i.exists[i.currentUrlParams.site + ":" + i.newTitle] && f(i.currentUrlParams.site, i.newTitle)
	}), i.$on("windowWidthChanged", function (r, e) { })
}]);