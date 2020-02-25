$(function(){
    var isLoadCBCT = false;
    var selectedPatentId;
    var caseId;
    $("#show-patient").attr("src","images/show-patient_light.png");
    $("#show-treatment").attr("src","images/show-treatment_light.png");
    $("#show-comment").attr("src","images/show-comment_light.png");
    $("#show-patient2").attr("src","images/show-patient_light.png");
    $(".reg-tool-p").css('display','none');
    //左侧下拉菜单
    $('.inactive').click(function () {
        if ($(this).siblings('ul').css('display') == 'none') {
            $(this).parent('li').siblings('li').removeClass('inactives');
            $(this).addClass('inactives');
            $(this).siblings('ul').slideDown(100).children('li');
            //显示acquireCBCTButton
            var series = $(this).attr('series');
            if (series && series=='1'){
                $(".img-tool-p").css('display','');
            }
            //获取选择的patient
            if ($(this).attr('pantientid')){
                selectedPatentId = $(this).attr('pantientid');
            }
            if ($(this).parents('li').siblings('li')){
                var liList = $(this).parents('li').siblings('li');
                $.each( liList, function( val, index){
                    if($(this).children('ul').css('display') == 'block'){
                        $(this).children('ul').parent('li').children('a').removeClass('inactives');
                        $(this).children('ul').slideUp(100);
                    }
                })
            }
        } else {
            //隐藏acquireCBCTButton
            var series = $(this).attr('series');
            if (series && series=='1'){
                $(".img-tool-p").css('display','none');
            }
            //取消选择的patient
            if ($(this).attr('pantientid')){
                selectedPatentId = null;
            }
            //控制自身变成+号
            $(this).removeClass('inactives');
            //控制自身菜单下子菜单隐藏
            $(this).siblings('ul').slideUp(100);
            //控制自身子菜单变成+号
            $(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
            //控制自身菜单下子菜单隐藏
            $(this).siblings('ul').children('li').children('ul').slideUp(100);

            //控制同级菜单只保持一个是展开的（-号显示）
            $(this).siblings('ul').children('li').children('a').removeClass('inactives');
        }
    });
    //隐藏显示左侧菜单栏
    function toggleMenu() {
        if('none' != $('#hidden-patient-info').css('display')){
            $('#patient-info-div').width('12%');
            $('#transverse-div').width('41%');
            $('#sagital-div').width('23%');
            $('#tool-div').width('15%');
            //$('#leftMenu').css('display','none');
            $('#hidden-patient-info').css('display','none');
            $('#patient-info-div').css('display','');
        } else {
            $('#patient-info-div').width('14%');
            $('#transverse-div').width('45%');
            $('#sagital-div').width('28%');
            $('#tool-div').width('17%');
            //$('#leftMenu').css('display','');
            $('#hidden-patient-info').css('display','');
            $('#patient-info-div').css('display','none');
        }
    }
    $('#show-patient').click(toggleMenu);
    $('#show-comment').click(toggleMenu);
    $('#show-treatment').click(toggleMenu);
    $('#show-list').click(toggleMenu);
    //隐藏左侧菜单栏
    function toggleLeftMenu() {
        if('table-cell' == $('#leftMenu').css('display')){
            $(this).attr("title","show menu");
            $('#leftMenu').css('display','none');
            $('#nav-menu').css('display','none');
            $('#input-icon').css('display','');
        } else {
            $(this).attr("title","hidden menu");
            $('#leftMenu').css('display','table-cell');
            $('#nav-menu').css('display','');
            $('#input-icon').css('display','none');
        }
    }
    $('[data-toggle="offLeftMenu"]').click(toggleLeftMenu);
    $('#input-icon').click(toggleLeftMenu);
    //下拉选择W/L
    $('.drop-wl').click(function(e){
        $('#CBCTWidth').val($(this).attr('sw'));
        $('#CBCTHeight').val($(this).attr('sl'));
        //TODO operate image

    })
    $("[series='2']").click(function(e) {
        //设置加载的caseId
        caseId = $(this).attr("ct_id");
        $.each($("[series='2']"),function(index,value){
            if(caseId ==  $(this).attr("ct_id")){
                $(this).css("color","#ED784A");
            }else{
                $(this).css("color","#1C1C1C");
            }
        })
    })
    //获取CBCT
    function loadCBCT() {
        if (!selectedPatentId){
            $.alert({
                title: 'Alert',
                content: 'Please Select Patient!'
            });
            return;
        }
        //
        //选择的加载的CBCT caseId
        if(!caseId){
            $.alert({
                title: 'Alert',
                content: 'Please Select Reg Case!'
            });
            return;
        }
        console.log("loading caseid:" + caseId);
        $.confirm({
            title: 'About to start CBCT acquisition',
            content: 'Confirm CBCT acquisition',
            columnClass: 'medium',
            closeIcon: true,
            closeIconClass: 'fa fa-close',
            buttons: {
                confirm: function() {
                    isLoadCBCT = true;
                    //TODO load CBCT IMG
                    console.log("load CBCT IMG");
                    //启用Reg功能
                    $(".reg-tool-p").css('display','');
                },
                cancel: function() {
                    //取消按钮
                }
            }
        });
    }
    $('#printCouchShift').click(function(e){
        $.confirm({
            title: 'Ready to treat',
            content: 'Confirm printing?',
            closeIcon: true,
            columnClass: 'medium',
            closeIconClass: 'fa fa-close',
            buttons: {
                Print: function() {
                    $.alert({
                        title: 'Couch Shift',
                        closeIcon: true,
                        content: '' + '<div style="height: 350px;"><div class="box-header"><h3 class="box-title" style="background-color: #FFFFFF;text-align: center;">PDF or Hard-copy</h3></div>' +
                        '<div class="box-body"><p><span>Patient Info:</span><span>&nbsp;</span></p><p><span>Treatment Info:</span><span>&nbsp;</span></p><p><span>Registration Name:</span><span>&nbsp;</span></p>' +
                        '<p><span>Registration Result:</span><span>&nbsp;</span></p><p><span>&nbsp;</span><span>&nbsp;</span></p><p><span>&nbsp;</span><span>&nbsp;</span></p><p><span>&nbsp;</span><span>&nbsp;</span></p>' + 
                        '<p><span>Operator:</span><span>&nbsp;</span></p><p><span>Print Date/Time:</span><span>&nbsp;</span></p></div></div>'
                    });
                },
                cancel: function() {
                    //取消按钮
                }
            }
        });
    })
    $('#acquireCBCTButton').click(function(e){
        if (isLoadCBCT){
            $.confirm({
                title: 'About to Load Another Patient',
                content: 'Save Current Changes And Load Another Patient?',
                closeIcon: true,
                columnClass: 'medium',
                closeIconClass: 'fa fa-close',
                buttons: {
                    Yes: function() {
                        //保存并打开新CBCT
                        //TODO save CBCT
                        console.log("save CBCT");
                        //TODO close CBCT IMG
                        console.log("close CBCT IMG");
                        //TODO 禁用Reg功能
                        $(".reg-tool-p").css('display','none');
                        isLoadCBCT = false;
                        loadCBCT();
                    },
                    No: function() {
                        //关闭之前打开的CBCT且不保存
                        //TODO close CBCT IMG
                        console.log("close CBCT IMG");
                        //TODO 禁用Reg功能
                        $(".reg-tool-p").css('display','none');
                        isLoadCBCT = false;
                        loadCBCT();
                    },
                    cancel: function() {
                        //取消按钮
                    }
                }
            });
        } else {
            loadCBCT();
        }
    })
})