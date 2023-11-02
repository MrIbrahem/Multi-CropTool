</div>
</main>

</body>
<script>
	function login() {
		var cat = $('#cat').val() || '';
		var code = $('#code').val() || '';
		var type = $('input[name=type]:checked').val() || '';

		var url = 'login.php?action=login';
		if (cat !== '') {
			url += '&cat=' + cat;
		}
		if (code !== '') {
			url += '&code=' + code;
		}
		if (type !== '') {
			url += '&type=' + type;
		}

		window.location.href = url;
	}
</script>
</html>
